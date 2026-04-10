import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactSubmission } from './entities/contact-submission.entity';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async submit(dto: CreateContactDto): Promise<ContactSubmission> {
    return this.contactRepository.create(dto);
  }
}
