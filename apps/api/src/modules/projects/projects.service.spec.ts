import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';

const baseProject = (overrides: Partial<Project> = {}): Project =>
  ({
    id: 1,
    url: 'demo',
    title: 'Demo',
    category: 'Web Application',
    thumbnailImg: '/img.jpg',
    headerPublishDate: 'Jan 1, 2026',
    headerTags: 'UI',
    clientHeading: 'About',
    objectivesHeading: 'Goal',
    objectivesDetails: 'details',
    projectDetailsHeading: 'Challenge',
    socialSharingHeading: 'Share',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    images: [],
    companyInfo: [],
    technologies: [],
    details: [],
    ...overrides,
  }) as Project;

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: jest.Mocked<ProjectsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsRepository,
          useValue: {
            findAllByCategory: jest.fn(),
            findOneByUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProjectsService);
    repository = module.get(ProjectsRepository);
  });

  it('list: repository 결과를 목록 DTO 로 매핑한다', async () => {
    repository.findAllByCategory.mockResolvedValue([
      baseProject({ id: 1, url: 'a', title: 'A' }),
      baseProject({ id: 2, url: 'b', title: 'B' }),
    ]);

    const result = await service.list({ category: 'Web Application' });

    expect(repository.findAllByCategory).toHaveBeenCalledWith(
      'Web Application',
    );
    expect(result).toEqual([
      {
        id: 1,
        title: 'A',
        url: 'a',
        category: 'Web Application',
        img: '/img.jpg',
      },
      {
        id: 2,
        title: 'B',
        url: 'b',
        category: 'Web Application',
        img: '/img.jpg',
      },
    ]);
  });

  it('list: category 미지정 시 undefined 그대로 위임한다', async () => {
    repository.findAllByCategory.mockResolvedValue([]);
    await service.list({});
    expect(repository.findAllByCategory).toHaveBeenCalledWith(undefined);
  });

  it('getByUrl: repository 가 null 반환 시 NotFoundException 을 던진다', async () => {
    repository.findOneByUrl.mockResolvedValue(null);
    await expect(service.getByUrl('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getByUrl: 정상 케이스에서 매퍼 결과를 반환한다', async () => {
    repository.findOneByUrl.mockResolvedValue(baseProject({ url: 'demo' }));
    const result = await service.getByUrl('demo');
    expect(result.url).toBe('demo');
    expect(result.ProjectHeader.title).toBe('Demo');
    expect(result.ProjectInfo.ClientHeading).toBe('About');
  });
});
