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
      },
    });
  }
}
