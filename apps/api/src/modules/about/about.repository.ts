import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutProfile } from './entities/about-profile.entity';

@Injectable()
export class AboutRepository {
  constructor(
    @InjectRepository(AboutProfile)
    private readonly repo: Repository<AboutProfile>,
  ) {}

  async findProfile(): Promise<AboutProfile | null> {
    return this.repo.findOne({
      where: { id: 1 },
      relations: { bios: true },
    });
  }
}
