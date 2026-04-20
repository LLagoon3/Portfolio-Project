import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutRepository } from './about.repository';
import { AboutProfile } from './entities/about-profile.entity';
import { AboutBio } from './entities/about-bio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AboutProfile, AboutBio])],
  controllers: [AboutController],
  providers: [AboutService, AboutRepository],
})
export class AboutModule {}
