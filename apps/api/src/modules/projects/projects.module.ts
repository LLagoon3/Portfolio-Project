import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { AdminProjectsController } from './admin-projects.controller';
import { AdminProjectsService } from './admin-projects.service';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { ProjectCompanyInfo } from './entities/project-company-info.entity';
import { ProjectTechnology } from './entities/project-technology.entity';
import { ProjectTechnologyItem } from './entities/project-technology-item.entity';
import { ProjectDetail } from './entities/project-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectImage,
      ProjectCompanyInfo,
      ProjectTechnology,
      ProjectTechnologyItem,
      ProjectDetail,
    ]),
  ],
  controllers: [ProjectsController, AdminProjectsController],
  providers: [ProjectsService, ProjectsRepository, AdminProjectsService],
})
export class ProjectsModule {}
