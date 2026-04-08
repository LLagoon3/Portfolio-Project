import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  ContactStatus,
  ContactSubmission,
} from './entities/contact-submission.entity';

describe('ContactController', () => {
  let controller: ContactController;
  let service: jest.Mocked<ContactService>;

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
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: { submit: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(ContactController);
    service = module.get(ContactService);
  });

  it('정상적으로 정의된다', () => {
    expect(controller).toBeDefined();
  });

  it('submit: service.submit 결과를 그대로 반환한다', async () => {
    service.submit.mockResolvedValue(saved);

    const result = await controller.submit(dto);

    expect(service.submit).toHaveBeenCalledTimes(1);
    expect(service.submit).toHaveBeenCalledWith(dto);
    expect(result).toBe(saved);
  });
});
