import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutRepository } from './about.repository';
import { AdminAboutController } from './admin-about.controller';
import { AdminAboutService } from './admin-about.service';
import { AboutProfile } from './entities/about-profile.entity';
import { AboutBio } from './entities/about-bio.entity';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([AboutProfile, AboutBio]), UploadsModule],
  controllers: [AboutController, AdminAboutController],
  providers: [AboutService, AboutRepository, AdminAboutService],
})
export class AboutModule {}
