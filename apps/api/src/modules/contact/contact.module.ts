import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';
import { AdminContactController } from './admin-contact.controller';
import { AdminContactService } from './admin-contact.service';
import { ContactSubmission } from './entities/contact-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission])],
  controllers: [ContactController, AdminContactController],
  providers: [ContactService, ContactRepository, AdminContactService],
})
export class ContactModule {}
