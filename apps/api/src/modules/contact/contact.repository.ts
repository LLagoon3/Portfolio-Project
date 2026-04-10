import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly repo: Repository<ContactSubmission>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactSubmission> {
    const submission = this.repo.create(dto);
    return this.repo.save(submission);
  }
}
