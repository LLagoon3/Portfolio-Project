import { Injectable, NotFoundException } from '@nestjs/common';
import { AboutRepository } from './about.repository';
import { AboutResponseDto } from './dto/about-response.dto';
import { toAboutResponseDto } from './mappers/about.mapper';

@Injectable()
export class AboutService {
  constructor(private readonly aboutRepository: AboutRepository) {}

  async get(): Promise<AboutResponseDto> {
    const profile = await this.aboutRepository.findProfile();
    if (!profile) {
      throw new NotFoundException('About profile has not been configured yet');
    }
    return toAboutResponseDto(profile);
  }
}
