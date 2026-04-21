import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import {
  ContactDetailDto,
  ContactListItemDto,
  ContactListPageDto,
} from './dto/contact-list.dto';
import { ListContactQueryDto } from './dto/list-contact-query.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class AdminContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly repo: Repository<ContactSubmission>,
  ) {}

  async list(query: ListContactQueryDto): Promise<ContactListPageDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [rows, total] = await this.repo.findAndCount({
      where: query.status ? { status: query.status } : {},
      order: { createdAt: 'DESC', id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    const items: ContactListItemDto[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      status: r.status,
      createdAt: r.createdAt,
    }));
    return { items, total, page, limit };
  }

  async getById(id: number): Promise<ContactDetailDto> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Contact submission not found: id=${id}`);
    }
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      subject: found.subject,
      message: found.message,
      status: found.status,
      createdAt: found.createdAt,
    };
  }

  async updateStatus(id: number, dto: UpdateStatusDto): Promise<ContactDetailDto> {
    const exists = await this.repo.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Contact submission not found: id=${id}`);
    }
    await this.repo.update(id, { status: dto.status });
    return this.getById(id);
  }
}
