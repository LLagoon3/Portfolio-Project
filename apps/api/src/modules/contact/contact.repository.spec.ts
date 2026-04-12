import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  ContactStatus,
  ContactSubmission,
} from './entities/contact-submission.entity';

describe('ContactRepository', () => {
  let repository: ContactRepository;
  let typeormRepo: jest.Mocked<Repository<ContactSubmission>>;

  const dto: CreateContactDto = {
    name: '홍길동',
    email: 'hong@example.com',
    subject: '문의',
    message: '안녕하세요',
  };

  const entity: ContactSubmission = {
    id: 0,
    ...dto,
    status: ContactStatus.PENDING,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const saved: ContactSubmission = { ...entity, id: 42 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactRepository,
        {
          provide: getRepositoryToken(ContactSubmission),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(ContactRepository);
    typeormRepo = module.get(getRepositoryToken(ContactSubmission));
  });

  it('정상적으로 정의된다', () => {
    expect(repository).toBeDefined();
  });

  it('create: typeorm repo.create → repo.save 순서로 호출하고 저장된 엔티티를 반환한다', async () => {
    typeormRepo.create.mockReturnValue(entity);
    typeormRepo.save.mockResolvedValue(saved);

    const result = await repository.create(dto);

    expect(typeormRepo.create).toHaveBeenCalledWith(dto);
    expect(typeormRepo.save).toHaveBeenCalledWith(entity);
    expect(result).toBe(saved);
  });
});
