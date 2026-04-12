import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { toProjectDetailDto } from './mappers/project-detail.mapper';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async list(query: ListProjectsQueryDto): Promise<ProjectListItemDto[]> {
    const projects = await this.projectsRepository.findAllByCategory(
      query.category,
    );
    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      url: project.url,
      category: project.category,
      img: project.thumbnailImg,
    }));
  }

  async getByUrl(url: string): Promise<ProjectDetailDto> {
    const project = await this.projectsRepository.findOneByUrl(url);
    if (!project) {
      throw new NotFoundException(`Project not found: ${url}`);
    }
    return toProjectDetailDto(project);
  }
}
