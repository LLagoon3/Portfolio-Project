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
import { ProjectTechnology } from '../../modules/projects/entities/project-technology.entity';
import { ProjectTechnologyItem } from '../../modules/projects/entities/project-technology-item.entity';
import { ProjectDetail } from '../../modules/projects/entities/project-detail.entity';
import { ProjectStat } from '../../modules/projects/entities/project-stat.entity';
import { ProjectQuote } from '../../modules/projects/entities/project-quote.entity';
import { ProjectLink } from '../../modules/projects/entities/project-link.entity';

interface RawProject {
  id: number;
  title: string;
  url: string;
  category: string;
  img: string;
  heroAccentWord?: string | null;
  heroRole?: string | null;
  heroClient?: string | null;
  ProjectHeader: { title: string; publishDate: string };
  ProjectImages: { title: string; img: string }[];
  ProjectInfo: {
    ObjectivesDetails: string;
    Technologies: { title: string; techs: string[] }[];
    ProjectDetails: {
      kind?: string | null;
      title?: string | null;
      details: string;
    }[];
    Impact?: { label: string; value: string; sub?: string | null }[];
    Quote?: { text: string; author?: string | null } | null;
    Links?: { label: string; url: string }[];
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
    await manager.query('TRUNCATE TABLE PROJECT_LINK');
    await manager.query('TRUNCATE TABLE PROJECT_QUOTE');
    await manager.query('TRUNCATE TABLE PROJECT_STAT');
    await manager.query('TRUNCATE TABLE PROJECT_TECHNOLOGY_ITEM');
    await manager.query('TRUNCATE TABLE PROJECT_TECHNOLOGY');
    await manager.query('TRUNCATE TABLE PROJECT_IMAGE');
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
    project.objectivesDetails = raw.ProjectInfo.ObjectivesDetails;
    project.heroAccentWord = raw.heroAccentWord ?? null;
    project.heroRole = raw.heroRole ?? null;
    project.heroClient = raw.heroClient ?? null;

    project.images = raw.ProjectImages.map((img, idx) => {
      const e = new ProjectImage();
      e.title = img.title;
      e.img = img.img;
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
      e.kind = detail.kind ?? null;
      e.title = detail.title ?? null;
      e.details = detail.details;
      e.sortOrder = idx;
      return e;
    });

    project.stats = (raw.ProjectInfo.Impact ?? []).map((stat, idx) => {
      const e = new ProjectStat();
      e.label = stat.label;
      e.value = stat.value;
      e.sub = stat.sub ?? null;
      e.sortOrder = idx;
      return e;
    });

    if (raw.ProjectInfo.Quote) {
      const quote = new ProjectQuote();
      quote.text = raw.ProjectInfo.Quote.text;
      quote.author = raw.ProjectInfo.Quote.author ?? null;
      project.quote = quote;
    } else {
      project.quote = null;
    }

    project.links = (raw.ProjectInfo.Links ?? []).map((link, idx) => {
      const e = new ProjectLink();
      e.label = link.label;
      e.url = link.url;
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
