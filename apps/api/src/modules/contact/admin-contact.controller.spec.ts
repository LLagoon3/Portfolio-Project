import { Test, TestingModule } from '@nestjs/testing';
import { AdminContactController } from './admin-contact.controller';
import { AdminContactService } from './admin-contact.service';
import { ContactStatus } from './entities/contact-submission.entity';

describe('AdminContactController', () => {
  let controller: AdminContactController;
  let service: jest.Mocked<AdminContactService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminContactController],
      providers: [
        {
          provide: AdminContactService,
          useValue: {
            list: jest.fn(),
            getById: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AdminContactController);
    service = module.get(AdminContactService);
  });

  it('list: query 를 service.list 에 위임', async () => {
    const page = { items: [], total: 0, page: 1, limit: 20 } as never;
    service.list.mockResolvedValue(page);
    const result = await controller.list({ status: ContactStatus.PENDING });
    expect(service.list).toHaveBeenCalledWith({ status: ContactStatus.PENDING });
    expect(result).toBe(page);
  });

  it('getById: service.getById(id) 위임', async () => {
    const detail = { id: 5 } as never;
    service.getById.mockResolvedValue(detail);
    const result = await controller.getById(5);
    expect(service.getById).toHaveBeenCalledWith(5);
    expect(result).toBe(detail);
  });

  it('updateStatus: (id, dto) 를 service 로 위임', async () => {
    const detail = { id: 7, status: ContactStatus.READ } as never;
    service.updateStatus.mockResolvedValue(detail);
    const dto = { status: ContactStatus.READ };
    const result = await controller.updateStatus(7, dto);
    expect(service.updateStatus).toHaveBeenCalledWith(7, dto);
    expect(result).toBe(detail);
  });
});
