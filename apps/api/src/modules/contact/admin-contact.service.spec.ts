import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminContactService } from './admin-contact.service';
import {
  ContactStatus,
  ContactSubmission,
} from './entities/contact-submission.entity';

const row = (overrides: Partial<ContactSubmission> = {}): ContactSubmission =>
  ({
    id: 1,
    name: 'Alice',
    email: 'a@example.com',
    subject: 'hello',
    message: 'body',
    status: ContactStatus.PENDING,
    createdAt: new Date('2026-04-01T00:00:00.000Z'),
    ...overrides,
  }) as ContactSubmission;

describe('AdminContactService', () => {
  let service: AdminContactService;
  let repo: jest.Mocked<Repository<ContactSubmission>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminContactService,
        {
          provide: getRepositoryToken(ContactSubmission),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AdminContactService);
    repo = module.get(getRepositoryToken(ContactSubmission));
  });

  describe('list', () => {
    it('status 미지정 시 빈 where 로 페이징 조회', async () => {
      repo.findAndCount.mockResolvedValue([[row()], 1]);
      const result = await service.list({});
      expect(repo.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC', id: 'DESC' },
        take: 20,
        skip: 0,
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('status 지정 시 where 에 포함, page/limit 반영된 skip 계산', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);
      await service.list({
        status: ContactStatus.READ,
        page: 3,
        limit: 5,
      });
      expect(repo.findAndCount).toHaveBeenCalledWith({
        where: { status: ContactStatus.READ },
        order: { createdAt: 'DESC', id: 'DESC' },
        take: 5,
        skip: 10,
      });
    });

    it('응답은 message 를 포함하지 않는다 (목록 경량화)', async () => {
      repo.findAndCount.mockResolvedValue([[row({ message: 'secret body' })], 1]);
      const result = await service.list({});
      const item = result.items[0] as unknown as Record<string, unknown>;
      expect(item.message).toBeUndefined();
    });
  });

  describe('getById', () => {
    it('없으면 NotFoundException', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getById(99)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('있으면 message 포함 전체 필드 반환', async () => {
      repo.findOne.mockResolvedValue(row({ id: 2, message: 'hi' }));
      const result = await service.getById(2);
      expect(result.id).toBe(2);
      expect(result.message).toBe('hi');
    });
  });

  describe('updateStatus', () => {
    it('대상 없으면 NotFoundException', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(
        service.updateStatus(9, { status: ContactStatus.READ }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('성공 시 update 호출 후 최신 데이터 반환', async () => {
      repo.findOne
        .mockResolvedValueOnce(row({ id: 5, status: ContactStatus.PENDING }))
        .mockResolvedValueOnce(row({ id: 5, status: ContactStatus.READ }));
      repo.update.mockResolvedValue({ affected: 1, raw: {} } as never);

      const result = await service.updateStatus(5, {
        status: ContactStatus.READ,
      });

      expect(repo.update).toHaveBeenCalledWith(5, { status: ContactStatus.READ });
      expect(result.status).toBe(ContactStatus.READ);
    });
  });
});
