import { Test, TestingModule } from '@nestjs/testing';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

describe('AboutController', () => {
  let controller: AboutController;
  let service: jest.Mocked<AboutService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutController],
      providers: [
        {
          provide: AboutService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AboutController);
    service = module.get(AboutService);
  });

  it('get: service.get 결과를 그대로 반환한다', async () => {
    const data = {
      name: 'Lagoon',
      tagline: 'Backend Developer',
      profileImage: '/images/profile.jpeg',
      bio: ['첫 단락', '두 단락'],
      address: null,
      email: null,
      phone: null,
    };
    service.get.mockResolvedValue(data);

    const result = await controller.get();

    expect(service.get).toHaveBeenCalledTimes(1);
    expect(result).toBe(data);
  });
});
