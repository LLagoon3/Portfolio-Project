import { Test, TestingModule } from '@nestjs/testing';
import { AdminProjectsController } from './admin-projects.controller';
import { AdminProjectsService } from './admin-projects.service';
import { UpsertProjectDto } from './dto/upsert-project.dto';

const baseDto = (): UpsertProjectDto =>
  ({
    title: 'T',
    url: 't',
    category: 'Web Application',
    thumbnailImg: '/img.jpg',
    headerPublishDate: '2026',
    headerTags: 'UI',
    clientHeading: 'Client',
    objectivesHeading: 'Goal',
    objectivesDetails: 'details',
    projectDetailsHeading: 'Challenge',
    images: [],
    companyInfo: [],
    technologies: [],
    details: [],
  }) as UpsertProjectDto;

describe('AdminProjectsController', () => {
  let controller: AdminProjectsController;
  let service: jest.Mocked<AdminProjectsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProjectsController],
      providers: [
        {
          provide: AdminProjectsService,
          useValue: {
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AdminProjectsController);
    service = module.get(AdminProjectsService);
  });

  it('getById: service.getById 결과를 위임한다', async () => {
    const detail = { id: 1 } as never;
    service.getById.mockResolvedValue(detail);

    const result = await controller.getById(1);

    expect(service.getById).toHaveBeenCalledWith(1);
    expect(result).toBe(detail);
  });

  it('create: service.create 결과를 위임한다', async () => {
    const dto = baseDto();
    const detail = { id: 9 } as never;
    service.create.mockResolvedValue(detail);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(detail);
  });

  it('update: service.update(id, dto) 결과를 위임한다', async () => {
    const dto = baseDto();
    const detail = { id: 3 } as never;
    service.update.mockResolvedValue(detail);

    const result = await controller.update(3, dto);

    expect(service.update).toHaveBeenCalledWith(3, dto);
    expect(result).toBe(detail);
  });

  it('remove: service.remove(id) 를 호출하고 void 를 반환한다', async () => {
    service.remove.mockResolvedValue(undefined);

    const result = await controller.remove(7);

    expect(service.remove).toHaveBeenCalledWith(7);
    expect(result).toBeUndefined();
  });
});
