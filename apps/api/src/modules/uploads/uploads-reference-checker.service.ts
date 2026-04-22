import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AboutProfile } from '../about/entities/about-profile.entity';
import { ProjectImage } from '../projects/entities/project-image.entity';
import { Project } from '../projects/entities/project.entity';
import {
  resolveUploadFilename,
  UploadsStorageService,
} from './uploads-storage.service';

export interface ReferenceExcludeScope {
  excludeProjectId?: number;
  excludeAboutId?: number;
}

/**
 * 주어진 /uploads/<filename> URL 이 DB 의 어느 행에서라도 여전히 참조 중인지 확인한다.
 * - Projects (thumbnailImg)
 * - ProjectImages (img)
 * - AboutProfile (profileImage)
 *
 * 특정 레코드를 "업데이트/삭제 중" 이라 빼고 보고 싶으면 excludeXxxId 로 제외한다.
 */
@Injectable()
export class UploadsReferenceCheckerService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectImage)
    private readonly projectImageRepo: Repository<ProjectImage>,
    @InjectRepository(AboutProfile)
    private readonly aboutRepo: Repository<AboutProfile>,
  ) {}

  async isReferenced(
    url: string | null | undefined,
    scope: ReferenceExcludeScope = {},
  ): Promise<boolean> {
    const filename = resolveUploadFilename(url);
    if (!filename) return false;
    const fullUrl = UploadsStorageService.toUrl(filename);

    const [projectThumbnailCount, projectImageCount, aboutCount] =
      await Promise.all([
        this.projectRepo.count({
          where: {
            thumbnailImg: fullUrl,
            ...(scope.excludeProjectId != null
              ? { id: Not(scope.excludeProjectId) }
              : {}),
          },
        }),
        this.projectImageRepo.count({
          where: {
            img: fullUrl,
            ...(scope.excludeProjectId != null
              ? { projectId: Not(scope.excludeProjectId) }
              : {}),
          },
        }),
        this.aboutRepo.count({
          where: {
            profileImage: fullUrl,
            ...(scope.excludeAboutId != null
              ? { id: Not(scope.excludeAboutId) }
              : {}),
          },
        }),
      ]);

    return projectThumbnailCount + projectImageCount + aboutCount > 0;
  }
}
