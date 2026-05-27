import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UploadsReferenceCheckerService } from '../uploads/uploads-reference-checker.service';
import {
  collectReferencedFilenames,
  UploadsStorageService,
} from '../uploads/uploads-storage.service';
import { Project } from './entities/project.entity';
import { ProjectCompanyInfo } from './entities/project-company-info.entity';
import { ProjectDetail } from './entities/project-detail.entity';
import { ProjectImage } from './entities/project-image.entity';
import { ProjectLink } from './entities/project-link.entity';
import { ProjectQuote } from './entities/project-quote.entity';
import { ProjectStat } from './entities/project-stat.entity';
import { ProjectTechnology } from './entities/project-technology.entity';
import { ProjectTechnologyItem } from './entities/project-technology-item.entity';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { toProjectDetailDto } from './mappers/project-detail.mapper';

function collectProjectUploadUrls(project: Project): (string | null | undefined)[] {
  return [
    project.thumbnailImg,
    ...(project.images ?? []).map((img) => img.img),
  ];
}

@Injectable()
export class AdminProjectsService {
  private readonly logger = new Logger(AdminProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly dataSource: DataSource,
    private readonly uploadsStorage: UploadsStorageService,
    private readonly uploadsRefChecker: UploadsReferenceCheckerService,
  ) {}

  async getById(id: number): Promise<ProjectDetailDto> {
    const project = await this.findOneWithRelations(id);
    if (!project) {
      throw new NotFoundException(`Project not found: id=${id}`);
    }
    return toProjectDetailDto(project);
  }

  async create(dto: UpsertProjectDto): Promise<ProjectDetailDto> {
    await this.assertUrlAvailable(dto.url);
    const saved = await this.dataSource.transaction(async (manager) => {
      const entity = buildProject(dto);
      return manager.save(Project, entity);
    });
    const loaded = await this.findOneWithRelations(saved.id);
    return toProjectDetailDto(loaded!);
  }

  async update(id: number, dto: UpsertProjectDto): Promise<ProjectDetailDto> {
    const existing = await this.findOneWithRelations(id);
    if (!existing) {
      throw new NotFoundException(`Project not found: id=${id}`);
    }
    if (dto.url !== existing.url) {
      await this.assertUrlAvailable(dto.url, id);
    }

    await this.dataSource.transaction(async (manager) => {
      // 자식 관계를 전부 비우고 재삽입. 이미지 섬네일 하나 바꾸더라도 일관되게 덮어쓴다.
      const techs = await manager.find(ProjectTechnology, {
        where: { projectId: id },
        select: { id: true },
      });
      const techIds = techs.map((t) => t.id);
      if (techIds.length > 0) {
        await manager.delete(ProjectTechnologyItem, {
          technologyId: In(techIds),
        });
      }
      await manager.delete(ProjectTechnology, { projectId: id });
      await manager.delete(ProjectImage, { projectId: id });
      await manager.delete(ProjectCompanyInfo, { projectId: id });
      await manager.delete(ProjectDetail, { projectId: id });
      await manager.delete(ProjectStat, { projectId: id });
      await manager.delete(ProjectQuote, { projectId: id });
      await manager.delete(ProjectLink, { projectId: id });

      const updated = buildProject(dto);
      updated.id = id;
      await manager.save(Project, updated);
    });

    // 업데이트 전후 참조 비교해 고아가 된 /uploads/* 파일만 정리.
    // 현재 프로젝트는 이미 새 상태가 저장됐으므로 excludeProjectId 없이 검사해도 되지만,
    // DB 조회 타이밍의 경쟁 상태 대비 현재 id 를 exclude 해도 안전.
    const oldFiles = collectReferencedFilenames(collectProjectUploadUrls(existing));
    const newFiles = collectReferencedFilenames([
      dto.thumbnailImg,
      ...dto.images.map((img) => img.img),
    ]);
    await this.cleanupStaleFiles(oldFiles, newFiles, { excludeProjectId: id });

    const loaded = await this.findOneWithRelations(id);
    return toProjectDetailDto(loaded!);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOneWithRelations(id);
    if (!existing) {
      throw new NotFoundException(`Project not found: id=${id}`);
    }
    const filenames = collectReferencedFilenames(collectProjectUploadUrls(existing));

    const result = await this.projectRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Project not found: id=${id}`);
    }

    await this.cleanupStaleFiles(filenames, new Set(), { excludeProjectId: id });
  }

  private async cleanupStaleFiles(
    before: Set<string>,
    after: Set<string>,
    exclude: { excludeProjectId?: number } = {},
  ): Promise<void> {
    for (const filename of before) {
      if (after.has(filename)) continue;
      const url = UploadsStorageService.toUrl(filename);
      try {
        // 다른 프로젝트/About 에서 여전히 이 URL 을 참조하면 파일을 남겨둔다.
        const stillReferenced = await this.uploadsRefChecker.isReferenced(url, {
          excludeProjectId: exclude.excludeProjectId,
        });
        if (stillReferenced) {
          this.logger.log(
            `[cleanupStaleFiles] ${filename} 은 다른 레코드가 여전히 참조 중 — 보존`,
          );
          continue;
        }
        await this.uploadsStorage.deleteByUrl(url);
      } catch (err) {
        // 파일 삭제/참조 확인 실패는 도메인 트랜잭션과 분리 — 로그만 남기고 진행
        this.logger.error(
          `[cleanupStaleFiles] ${filename} 정리 실패: ${(err as Error).message}`,
        );
      }
    }
  }

  private findOneWithRelations(id: number): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { id },
      relations: {
        images: true,
        companyInfo: true,
        technologies: { items: true },
        details: true,
        stats: true,
        quote: true,
        links: true,
      },
    });
  }

  private async assertUrlAvailable(url: string, excludingId?: number): Promise<void> {
    const found = await this.projectRepo.findOne({ where: { url } });
    if (found && found.id !== excludingId) {
      throw new ConflictException(`url slug already in use: ${url}`);
    }
  }
}

function buildProject(dto: UpsertProjectDto): Project {
  const project = new Project();
  project.url = dto.url;
  project.title = dto.title;
  project.category = dto.category;
  project.thumbnailImg = dto.thumbnailImg;
  project.headerPublishDate = dto.headerPublishDate;
  project.headerTags = dto.headerTags;
  project.clientHeading = dto.clientHeading;
  project.objectivesHeading = dto.objectivesHeading;
  project.objectivesDetails = dto.objectivesDetails;
  project.projectDetailsHeading = dto.projectDetailsHeading;
  project.socialSharingHeading = dto.socialSharingHeading ?? '';
  // Phase 2: 빈 문자열은 null 로 정규화 (DB nullable).
  project.heroSubtitle = dto.heroSubtitle?.trim() ? dto.heroSubtitle : null;
  project.heroAccentWord = dto.heroAccentWord?.trim()
    ? dto.heroAccentWord
    : null;
  project.heroRole = dto.heroRole?.trim() ? dto.heroRole : null;
  project.heroClient = dto.heroClient?.trim() ? dto.heroClient : null;

  project.images = dto.images.map((img, idx) => {
    const e = new ProjectImage();
    e.title = img.title;
    e.img = img.img;
    e.sortOrder = idx;
    return e;
  });

  project.companyInfo = dto.companyInfo.map((info, idx) => {
    const e = new ProjectCompanyInfo();
    e.title = info.title;
    e.details = info.details;
    e.sortOrder = idx;
    return e;
  });

  project.technologies = dto.technologies.map((tech, idx) => {
    const e = new ProjectTechnology();
    e.title = tech.title;
    e.sortOrder = idx;
    e.items = tech.techs.map((name, j) => {
      const item = new ProjectTechnologyItem();
      item.name = name;
      item.sortOrder = j;
      return item;
    });
    return e;
  });

  project.details = dto.details.map((detail, idx) => {
    const e = new ProjectDetail();
    // Phase 2 후속 — admin 명시 kind/title 은 trim 후 null 정규화. 미입력 entry 는
    // web 의 parseProcessSteps 가 markdown h2 split 폴백으로 처리.
    e.kind = detail.kind?.trim() ? detail.kind : null;
    e.title = detail.title?.trim() ? detail.title : null;
    e.details = detail.details;
    e.sortOrder = idx;
    return e;
  });

  // Phase 2: stats (OneToMany) — 입력 순서대로 sort_order 부여.
  project.stats = (dto.stats ?? []).map((stat, idx) => {
    const e = new ProjectStat();
    e.label = stat.label;
    e.value = stat.value;
    e.sub = stat.sub?.trim() ? stat.sub : null;
    e.sortOrder = idx;
    return e;
  });

  // Phase 2: quote (OneToOne) — text 비면 null.
  if (dto.quote && dto.quote.text?.trim()) {
    const q = new ProjectQuote();
    q.text = dto.quote.text;
    q.author = dto.quote.author?.trim() ? dto.quote.author : null;
    project.quote = q;
  } else {
    project.quote = null;
  }

  // Links (OneToMany) — label/url 둘 다 있어야 살림. 입력 순서대로 sortOrder.
  project.links = (dto.links ?? [])
    .filter((l) => l.label?.trim() && l.url?.trim())
    .map((link, idx) => {
      const e = new ProjectLink();
      e.label = link.label.trim();
      e.url = link.url.trim();
      e.sortOrder = idx;
      return e;
    });

  return project;
}
