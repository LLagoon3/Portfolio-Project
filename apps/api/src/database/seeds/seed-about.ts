/* eslint-disable no-console */
import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { AboutProfile } from '../../modules/about/entities/about-profile.entity';
import { AboutBio } from '../../modules/about/entities/about-bio.entity';

interface RawAbout {
  name: string;
  tagline: string | null;
  profileImage: string;
  bio: string[];
}

function loadRawAbout(): RawAbout {
  const filePath = join(__dirname, 'about-data.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as RawAbout;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const dataSource = app.get(DataSource);
  const profileRepo = app.get<Repository<AboutProfile>>(
    getRepositoryToken(AboutProfile),
  );

  const raw = loadRawAbout();
  console.log(
    `[seed:about] loaded profile "${raw.name}" with ${raw.bio.length} bio paragraph(s)`,
  );

  await dataSource.transaction(async (manager) => {
    await manager.query('SET FOREIGN_KEY_CHECKS=0');
    await manager.query('TRUNCATE TABLE ABOUT_BIO');
    await manager.query('TRUNCATE TABLE ABOUT_PROFILE');
    await manager.query('SET FOREIGN_KEY_CHECKS=1');
  });

  const profile = new AboutProfile();
  profile.id = 1;
  profile.name = raw.name;
  profile.tagline = raw.tagline;
  profile.profileImage = raw.profileImage;
  profile.bios = raw.bio.map((paragraph, idx) => {
    const bio = new AboutBio();
    bio.paragraph = paragraph;
    bio.sortOrder = idx;
    return bio;
  });

  await profileRepo.save(profile);
  console.log(`[seed:about] inserted profile id=${profile.id}`);

  await app.close();
  console.log('[seed:about] done');
}

bootstrap().catch((err) => {
  console.error('[seed:about] failed:', err);
  process.exit(1);
});
