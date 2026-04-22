import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutProfile } from '../about/entities/about-profile.entity';
import { ProjectImage } from '../projects/entities/project-image.entity';
import { Project } from '../projects/entities/project.entity';
import { UploadsController } from './uploads.controller';
import { UploadsReferenceCheckerService } from './uploads-reference-checker.service';
import { UploadsStorageService } from './uploads-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectImage, AboutProfile])],
  controllers: [UploadsController],
  providers: [UploadsStorageService, UploadsReferenceCheckerService],
  exports: [UploadsStorageService, UploadsReferenceCheckerService],
})
export class UploadsModule {}
