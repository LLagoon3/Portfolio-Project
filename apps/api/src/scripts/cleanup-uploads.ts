/* eslint-disable no-console */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { AboutProfile } from '../modules/about/entities/about-profile.entity';
import { ProjectImage } from '../modules/projects/entities/project-image.entity';
import { Project } from '../modules/projects/entities/project.entity';
import {
  collectReferencedFilenames,
  UploadsStorageService,
} from '../modules/uploads/uploads-storage.service';

// /uploads 디렉터리에서 DB 가 참조하지 않는 고아 파일을 정리.
// 옵션:
//   --dry-run  실제로 삭제하지 않고 대상만 표시
//   --verbose  참조 파일도 함께 표기

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const verbose = args.has('--verbose');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const storage = app.get(UploadsStorageService);
  const projectRepo = app.get<Repository<Project>>(getRepositoryToken(Project));
  const projectImageRepo = app.get<Repository<ProjectImage>>(
    getRepositoryToken(ProjectImage),
  );
  const aboutRepo = app.get<Repository<AboutProfile>>(
    getRepositoryToken(AboutProfile),
  );

  const [projects, images, profiles] = await Promise.all([
    projectRepo.find({ select: { thumbnailImg: true } }),
    projectImageRepo.find({ select: { img: true } }),
    aboutRepo.find({ select: { profileImage: true } }),
  ]);

  const referenced = collectReferencedFilenames([
    ...projects.map((p) => p.thumbnailImg),
    ...images.map((i) => i.img),
    ...profiles.map((p) => p.profileImage),
  ]);

  console.log(
    `[cleanup:uploads] 참조 파일: ${referenced.size}건${dryRun ? ' (dry-run)' : ''}`,
  );
  if (verbose) {
    for (const f of [...referenced].sort()) {
      console.log(`  ref: ${f}`);
    }
  }

  const orphans = await storage.listOrphans(referenced);
  console.log(`[cleanup:uploads] 고아 파일: ${orphans.length}건`);

  if (orphans.length === 0) {
    await app.close();
    return;
  }

  let totalBytes = 0;
  for (const o of orphans) {
    totalBytes += o.bytes;
    if (dryRun) {
      console.log(`  would delete: ${o.filename} (${o.bytes}B)`);
    } else {
      await storage.deleteByUrl(UploadsStorageService.toUrl(o.filename));
      console.log(`  deleted: ${o.filename} (${o.bytes}B)`);
    }
  }
  console.log(
    `[cleanup:uploads] 총 ${orphans.length}건 / ${totalBytes}B${dryRun ? ' (계획만 출력됨)' : ' 정리 완료'}`,
  );

  await app.close();
}

main().catch((err) => {
  console.error('[cleanup:uploads] failed:', err);
  process.exit(1);
});
