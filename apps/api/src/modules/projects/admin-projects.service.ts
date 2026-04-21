import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  collectReferencedFilenames,
  UploadsStorageService,
} from '../uploads/uploads-storage.service';
import { Project } from './entities/project.entity';
import { ProjectCompanyInfo } from './entities/project-company-info.entity';
import { ProjectDetail } from './entities/project-detail.entity';
import { ProjectImage } from './entities/project-image.entity';
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

      const updated = buildProject(dto);
      updated.id = id;
      await manager.save(Project, updated);
    });

    // 업데이트 전후 참조 비교해 고아가 된 /uploads/* 파일만 정리.
    const oldFiles = collectReferencedFilenames(collectProjectUploadUrls(existing));
    const newFiles = collectReferencedFilenames([
      dto.thumbnailImg,
      ...dto.images.map((img) => img.img),
    ]);
    await this.cleanupStaleFiles(oldFiles, newFiles);

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

    await this.cleanupStaleFiles(filenames, new Set());
  }

  private async cleanupStaleFiles(
    before: Set<string>,
    after: Set<string>,
  ): Promise<void> {
    for (const filename of before) {
      if (after.has(filename)) continue;
      try {
        await this.uploadsStorage.deleteByUrl(
          UploadsStorageService.toUrl(filename),
        );
      } catch (err) {
        // 파일 삭제 실패는 도메인 트랜잭션과 분리 — 로그만 남기고 진행
        this.logger.error(
          `[cleanupStaleFiles] ${filename} 삭제 실패: ${(err as Error).message}`,
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
    e.details = detail.details;
    e.sortOrder = idx;
    return e;
  });

  return project;
}
