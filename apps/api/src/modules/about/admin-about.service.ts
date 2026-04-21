import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AboutBio } from './entities/about-bio.entity';
import { AboutProfile } from './entities/about-profile.entity';
import { UpsertAboutDto } from './dto/upsert-about.dto';
import { AboutResponseDto } from './dto/about-response.dto';
import { toAboutResponseDto } from './mappers/about.mapper';

@Injectable()
export class AdminAboutService {
  constructor(
    @InjectRepository(AboutProfile)
    private readonly profileRepo: Repository<AboutProfile>,
    private readonly dataSource: DataSource,
  ) {}

  async upsert(dto: UpsertAboutDto): Promise<AboutResponseDto> {
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
