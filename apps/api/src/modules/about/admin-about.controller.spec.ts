import { Test, TestingModule } from '@nestjs/testing';
import { AdminAboutController } from './admin-about.controller';
import { AdminAboutService } from './admin-about.service';
import { UpsertAboutDto } from './dto/upsert-about.dto';

describe('AdminAboutController', () => {
  let controller: AdminAboutController;
  let service: jest.Mocked<AdminAboutService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAboutController],
      providers: [
        {
          provide: AdminAboutService,
          useValue: { upsert: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(AdminAboutController);
    service = module.get(AdminAboutService);
  });

  it('upsert: service.upsert 결과를 위임한다', async () => {
    const dto: UpsertAboutDto = {
      name: 'Lagoon',
      tagline: 'Backend',
      profileImage: '/images/profile.jpeg',
      bio: ['p1', 'p2'],
    };
    const returned = { name: 'Lagoon' } as never;
    service.upsert.mockResolvedValue(returned);

    const result = await controller.upsert(dto);

    expect(service.upsert).toHaveBeenCalledWith(dto);
    expect(result).toBe(returned);
  });
});
