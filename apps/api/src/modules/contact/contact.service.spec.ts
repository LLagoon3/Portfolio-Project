import { Test, TestingModule } from '@nestjs/testing';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  ContactStatus,
  ContactSubmission,
} from './entities/contact-submission.entity';

describe('ContactService', () => {
  let service: ContactService;
  let repository: jest.Mocked<ContactRepository>;

  const dto: CreateContactDto = {
    name: '홍길동',
    email: 'hong@example.com',
    subject: '문의',
    message: '안녕하세요',
  };

  const saved: ContactSubmission = {
    id: 1,
    ...dto,
    status: ContactStatus.PENDING,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ContactRepository,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(ContactService);
    repository = module.get(ContactRepository);
  });

  it('정상적으로 정의된다', () => {
    expect(service).toBeDefined();
  });

  it('submit: repository.create 에 dto 를 그대로 위임하고 결과를 반환한다', async () => {
    repository.create.mockResolvedValue(saved);

    const result = await service.submit(dto);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(saved);
  });

  it('submit: repository 에서 던진 에러를 그대로 전파한다', async () => {
    const err = new Error('db down');
    repository.create.mockRejectedValue(err);

    await expect(service.submit(dto)).rejects.toThrow('db down');
  });
});
