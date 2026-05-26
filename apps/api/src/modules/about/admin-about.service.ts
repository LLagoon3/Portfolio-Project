import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UploadsReferenceCheckerService } from '../uploads/uploads-reference-checker.service';
import {
  resolveUploadFilename,
  UploadsStorageService,
} from '../uploads/uploads-storage.service';
import { AboutBio } from './entities/about-bio.entity';
import { AboutProfile } from './entities/about-profile.entity';
import { AboutStat } from './entities/about-stat.entity';
import { AboutPrinciple } from './entities/about-principle.entity';
import { AboutJourney } from './entities/about-journey.entity';
import { AboutSocial } from './entities/about-social.entity';
import { AboutFaq } from './entities/about-faq.entity';
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
    private readonly uploadsRefChecker: UploadsReferenceCheckerService,
  ) {}

  async upsert(dto: UpsertAboutDto): Promise<AboutResponseDto> {
    // 업데이트 전 profile 이미지 URL 을 기억 → 변경된 경우 고아 /uploads 파일 정리
    const previousProfile = await this.profileRepo.findOne({ where: { id: 1 } });
    const previousImageUrl = previousProfile?.profileImage ?? null;

    await this.dataSource.transaction(async (manager) => {
      // bio / stat / principle / journey 모두 id=1 singleton 에 묶인 자식이라
      // 입력값으로 전량 교체. sortOrder 는 입력 순서 그대로 부여.
      await manager.delete(AboutBio, { profileId: 1 });
      await manager.delete(AboutStat, { profileId: 1 });
      await manager.delete(AboutPrinciple, { profileId: 1 });
      await manager.delete(AboutJourney, { profileId: 1 });
      await manager.delete(AboutSocial, { profileId: 1 });
      await manager.delete(AboutFaq, { profileId: 1 });

      const profile = new AboutProfile();
      profile.id = 1;
      profile.name = dto.name;
      profile.tagline = dto.tagline ?? null;
      profile.profileImage = dto.profileImage;
      profile.address = dto.address ?? null;
      profile.email = dto.email ?? null;
      profile.phone = dto.phone ?? null;
      profile.availability = dto.availability ?? null;
      profile.stacks = dto.stacks ?? [];

      profile.bios = dto.bio.map((paragraph, idx) => {
        const bio = new AboutBio();
        bio.paragraph = paragraph;
        bio.sortOrder = idx;
        return bio;
      });
      profile.stats = (dto.stats ?? []).map((s, idx) => {
        const stat = new AboutStat();
        stat.label = s.label;
        stat.value = s.value;
        stat.sub = s.sub ?? null;
        stat.sortOrder = idx;
        return stat;
      });
      profile.principles = (dto.principles ?? []).map((p, idx) => {
        const principle = new AboutPrinciple();
        principle.title = p.title;
        principle.body = p.body;
        principle.sortOrder = idx;
        return principle;
      });
      profile.journeys = (dto.journey ?? []).map((j, idx) => {
        const journey = new AboutJourney();
        journey.year = j.year;
        journey.title = j.title;
        journey.role = j.role ?? null;
        journey.body = j.body;
        journey.sortOrder = idx;
        return journey;
      });
      profile.socials = (dto.socials ?? []).map((s, idx) => {
        const social = new AboutSocial();
        social.label = s.label;
        social.url = s.url;
        social.sortOrder = idx;
        return social;
      });
      profile.faqs = (dto.faqs ?? []).map((f, idx) => {
        const faq = new AboutFaq();
        faq.question = f.question;
        faq.answer = f.answer;
        faq.sortOrder = idx;
        return faq;
      });

      await manager.save(AboutProfile, profile);
    });

    if (previousImageUrl && previousImageUrl !== dto.profileImage) {
      const oldFilename = resolveUploadFilename(previousImageUrl);
      const newFilename = resolveUploadFilename(dto.profileImage);
      if (oldFilename && oldFilename !== newFilename) {
        try {
          // 다른 프로젝트에서 같은 /uploads URL 을 참조하면 파일을 남겨둔다.
          const stillReferenced = await this.uploadsRefChecker.isReferenced(
            previousImageUrl,
            { excludeAboutId: 1 },
          );
          if (stillReferenced) {
            this.logger.log(
              `[upsert] 이전 프로필 이미지 ${oldFilename} 는 다른 레코드가 참조 중 — 보존`,
            );
          } else {
            await this.uploadsStorage.deleteByUrl(previousImageUrl);
          }
        } catch (err) {
          this.logger.error(
            `[upsert] 이전 프로필 이미지 정리 실패: ${(err as Error).message}`,
          );
        }
      }
    }

    const loaded = await this.profileRepo.findOne({
      where: { id: 1 },
      relations: {
        bios: true,
        stats: true,
        principles: true,
        journeys: true,
        socials: true,
        faqs: true,
      },
    });
    // upsert 가 방금 끝났으니 null 일 리 없지만, 타입 만족을 위해 fallback
    if (!loaded) {
      throw new Error('[admin about] saved profile not found after upsert');
    }
    return toAboutResponseDto(loaded);
  }
}
