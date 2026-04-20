/* eslint-disable no-console */
import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Project } from '../../modules/projects/entities/project.entity';
import { ProjectImage } from '../../modules/projects/entities/project-image.entity';
import { ProjectCompanyInfo } from '../../modules/projects/entities/project-company-info.entity';
import { ProjectTechnology } from '../../modules/projects/entities/project-technology.entity';
import { ProjectTechnologyItem } from '../../modules/projects/entities/project-technology-item.entity';
import { ProjectDetail } from '../../modules/projects/entities/project-detail.entity';

interface RawProject {
  id: number;
  title: string;
  url: string;
  category: string;
  img: string;
  ProjectHeader: { title: string; publishDate: string; tags: string };
  ProjectImages: { title: string; img: string }[];
  ProjectInfo: {
    ClientHeading: string;
    CompanyInfo: { title: string; details: string }[];
    ObjectivesHeading: string;
    ObjectivesDetails: string;
    Technologies: { title: string; techs: string[] }[];
    ProjectDetailsHeading: string;
    ProjectDetails: { details: string }[];
    SocialSharingHeading: string;
  };
}

interface ProjectsDataFile {
  projects: RawProject[];
}

function loadRawProjects(): RawProject[] {
  const filePath = join(__dirname, 'portfolio-projects-data.json');
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as ProjectsDataFile;
  return parsed.projects;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const dataSource = app.get(DataSource);
  const projectRepo = app.get<Repository<Project>>(getRepositoryToken(Project));

  const raws = loadRawProjects();
  console.log(`[seed] loaded ${raws.length} projects from portfolio-projects-data.json`);

  await dataSource.transaction(async (manager) => {
    await manager.query('SET FOREIGN_KEY_CHECKS=0');
    await manager.query('TRUNCATE TABLE PROJECT_TECHNOLOGY_ITEM');
    await manager.query('TRUNCATE TABLE PROJECT_TECHNOLOGY');
    await manager.query('TRUNCATE TABLE PROJECT_IMAGE');
    await manager.query('TRUNCATE TABLE PROJECT_COMPANY_INFO');
    await manager.query('TRUNCATE TABLE PROJECT_DETAIL');
    await manager.query('TRUNCATE TABLE PROJECT');
    await manager.query('SET FOREIGN_KEY_CHECKS=1');
  });

  for (const raw of raws) {
    const project = new Project();
    project.url = raw.url;
    project.title = raw.title;
    project.category = raw.category;
    project.thumbnailImg = raw.img;
    project.headerPublishDate = raw.ProjectHeader.publishDate;
    project.headerTags = raw.ProjectHeader.tags;
    project.clientHeading = raw.ProjectInfo.ClientHeading;
    project.objectivesHeading = raw.ProjectInfo.ObjectivesHeading;
    project.objectivesDetails = raw.ProjectInfo.ObjectivesDetails;
    project.projectDetailsHeading = raw.ProjectInfo.ProjectDetailsHeading;
    project.socialSharingHeading = raw.ProjectInfo.SocialSharingHeading;

    project.images = raw.ProjectImages.map((img, idx) => {
      const e = new ProjectImage();
      e.title = img.title;
      e.img = img.img;
      e.sortOrder = idx;
      return e;
    });

    project.companyInfo = raw.ProjectInfo.CompanyInfo.map((info, idx) => {
      const e = new ProjectCompanyInfo();
      e.title = info.title;
      e.details = info.details;
      e.sortOrder = idx;
      return e;
    });

    project.technologies = raw.ProjectInfo.Technologies.map((tech, idx) => {
      const e = new ProjectTechnology();
      e.title = tech.title;
      e.sortOrder = idx;
      e.items = tech.techs.map((name, j) => {
        const item = new ProjectTechnologyItem();
        item.name = name;
        item.sortOrder = j;
        return item;
      });
      return e;
    });

    project.details = raw.ProjectInfo.ProjectDetails.map((detail, idx) => {
      const e = new ProjectDetail();
      e.details = detail.details;
      e.sortOrder = idx;
      return e;
    });

    await projectRepo.save(project);
    console.log(`[seed] inserted: ${project.url}`);
  }

  await app.close();
  console.log('[seed] done');
}

bootstrap().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
