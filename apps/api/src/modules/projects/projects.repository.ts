import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  async findAllByCategory(category?: string): Promise<Project[]> {
    return this.repo.find({
      where: category ? { category } : {},
      order: { id: 'ASC' },
    });
  }

  async findOneByUrl(url: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { url },
      relations: {
        images: true,
        companyInfo: true,
        technologies: { items: true },
        details: true,
        // Phase 2 — 공개 detail 페이지의 Impact / Quote 섹션이 보이도록 함께 로드.
        stats: true,
        quote: true,
      },
    });
  }
}
