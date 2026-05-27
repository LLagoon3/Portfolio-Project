import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutRepository } from './about.repository';
import { AdminAboutController } from './admin-about.controller';
import { AdminAboutService } from './admin-about.service';
import { AboutProfile } from './entities/about-profile.entity';
import { AboutBio } from './entities/about-bio.entity';
import { AboutStat } from './entities/about-stat.entity';
import { AboutPrinciple } from './entities/about-principle.entity';
import { AboutJourney } from './entities/about-journey.entity';
import { AboutSocial } from './entities/about-social.entity';
import { AboutFaq } from './entities/about-faq.entity';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AboutProfile,
      AboutBio,
      AboutStat,
      AboutPrinciple,
      AboutJourney,
      AboutSocial,
      AboutFaq,
    ]),
    UploadsModule,
  ],
  controllers: [AboutController, AdminAboutController],
  providers: [AboutService, AboutRepository, AdminAboutService],
})
export class AboutModule {}
