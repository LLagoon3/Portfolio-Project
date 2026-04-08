import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<ProjectsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            list: jest.fn(),
            getByUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ProjectsController);
    service = module.get(ProjectsService);
  });

  it('list: service.list 결과를 그대로 반환한다', async () => {
    const data = [
      { id: 1, title: 'A', url: 'a', category: 'Web Application', img: '/a' },
    ];
    service.list.mockResolvedValue(data);

    const result = await controller.list({ category: 'Web Application' });

    expect(service.list).toHaveBeenCalledWith({ category: 'Web Application' });
    expect(result).toBe(data);
  });

  it('getByUrl: service.getByUrl 에 url 을 위임한다', async () => {
    const detail = { url: 'demo' } as never;
    service.getByUrl.mockResolvedValue(detail);

    const result = await controller.getByUrl('demo');

    expect(service.getByUrl).toHaveBeenCalledWith('demo');
    expect(result).toBe(detail);
  });
});
