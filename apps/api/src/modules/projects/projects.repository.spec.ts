import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsRepository } from './projects.repository';
import { Project } from './entities/project.entity';

describe('ProjectsRepository', () => {
  let repository: ProjectsRepository;
  let typeormRepo: jest.Mocked<Repository<Project>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsRepository,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(ProjectsRepository);
    typeormRepo = module.get(getRepositoryToken(Project));
  });

  it('findAllByCategory: category 지정 시 where 절에 포함한다', async () => {
    typeormRepo.find.mockResolvedValue([]);
    await repository.findAllByCategory('Web Application');

    expect(typeormRepo.find).toHaveBeenCalledWith({
      where: { category: 'Web Application' },
      order: { id: 'ASC' },
    });
  });

  it('findAllByCategory: category 미지정 시 빈 where 로 전체 조회한다', async () => {
    typeormRepo.find.mockResolvedValue([]);
    await repository.findAllByCategory(undefined);

    expect(typeormRepo.find).toHaveBeenCalledWith({
      where: {},
      order: { id: 'ASC' },
    });
  });

  it('findOneByUrl: url where + 모든 관계 로드 옵션을 전달한다', async () => {
    typeormRepo.findOne.mockResolvedValue(null);
    await repository.findOneByUrl('demo');

    expect(typeormRepo.findOne).toHaveBeenCalledWith({
      where: { url: 'demo' },
      relations: {
        images: true,
        companyInfo: true,
        technologies: { items: true },
        details: true,
      },
    });
  });
});
