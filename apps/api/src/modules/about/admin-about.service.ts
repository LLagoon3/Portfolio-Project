import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  resolveUploadFilename,
  UploadsStorageService,
} from '../uploads/uploads-storage.service';
import { AboutBio } from './entities/about-bio.entity';
import { AboutProfile } from './entities/about-profile.entity';
import { UpsertAboutDto } from './dto/upsert-about.dto';
import { AboutResponseDto } from './dto/about-response.dto';
import { toAboutResponseDto } from './mappers/about.mapper';

@Injectable()
export class AdminAboutService {
  private readonly logger = new Logger(AdminAboutService.name);

  constructor(
    @InjectRepository(AboutProfile)
    private readonly profileRepo: Repository<AboutProfile>,
    private readonly dataSource: DataSource,
    private readonly uploadsStorage: UploadsStorageService,
  ) {}

  async upsert(dto: UpsertAboutDto): Promise<AboutResponseDto> {
    // 업데이트 전 profile 이미지 URL 을 기억 → 변경된 경우 고아 /uploads 파일 정리
    const previousProfile = await this.profileRepo.findOne({ where: { id: 1 } });
    const previousImageUrl = previousProfile?.profileImage ?? null;

    await this.dataSource.transaction(async (manager) => {
      // bio 는 전량 교체 (id=1 고정 singleton 에 묶인 자식)
      await manager.delete(AboutBio, { profileId: 1 });

      const profile = new AboutProfile();
      profile.id = 1;
      profile.name = dto.name;
      profile.tagline = dto.tagline ?? null;
      profile.profileImage = dto.profileImage;
      profile.bios = dto.bio.map((paragraph, idx) => {
        const bio = new AboutBio();
        bio.paragraph = paragraph;
        bio.sortOrder = idx;
        return bio;
      });

      await manager.save(AboutProfile, profile);
    });

    if (previousImageUrl && previousImageUrl !== dto.profileImage) {
      const oldFilename = resolveUploadFilename(previousImageUrl);
      const newFilename = resolveUploadFilename(dto.profileImage);
      if (oldFilename && oldFilename !== newFilename) {
        try {
          await this.uploadsStorage.deleteByUrl(previousImageUrl);
        } catch (err) {
          this.logger.error(
            `[upsert] 이전 프로필 이미지 삭제 실패: ${(err as Error).message}`,
          );
        }
      }
    }

    const loaded = await this.profileRepo.findOne({
      where: { id: 1 },
      relations: { bios: true },
    });
    // upsert 가 방금 끝났으니 null 일 리 없지만, 타입 만족을 위해 fallback
    if (!loaded) {
      throw new Error('[admin about] saved profile not found after upsert');
    }
    return toAboutResponseDto(loaded);
  }
}
