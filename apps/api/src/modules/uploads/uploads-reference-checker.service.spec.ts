import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutProfile } from '../about/entities/about-profile.entity';
import { ProjectImage } from '../projects/entities/project-image.entity';
import { Project } from '../projects/entities/project.entity';
import { UploadsReferenceCheckerService } from './uploads-reference-checker.service';

describe('UploadsReferenceCheckerService', () => {
  let service: UploadsReferenceCheckerService;
  let projectRepo: jest.Mocked<Pick<Repository<Project>, 'count'>>;
  let imageRepo: jest.Mocked<Pick<Repository<ProjectImage>, 'count'>>;
  let aboutRepo: jest.Mocked<Pick<Repository<AboutProfile>, 'count'>>;

  beforeEach(async () => {
    projectRepo = { count: jest.fn() } as never;
    imageRepo = { count: jest.fn() } as never;
    aboutRepo = { count: jest.fn() } as never;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsReferenceCheckerService,
        { provide: getRepositoryToken(Project), useValue: projectRepo },
        { provide: getRepositoryToken(ProjectImage), useValue: imageRepo },
        { provide: getRepositoryToken(AboutProfile), useValue: aboutRepo },
      ],
    }).compile();

    service = module.get(UploadsReferenceCheckerService);
  });

  it('/uploads 가 아닌 URL 은 무조건 false', async () => {
    expect(await service.isReferenced('https://cdn/x.jpg')).toBe(false);
    expect(await service.isReferenced('/images/legacy.jpg')).toBe(false);
    expect(await service.isReferenced(null)).toBe(false);
    expect(projectRepo.count).not.toHaveBeenCalled();
  });

  it('세 테이블 전부 0 이면 false', async () => {
    projectRepo.count.mockResolvedValue(0);
    imageRepo.count.mockResolvedValue(0);
    aboutRepo.count.mockResolvedValue(0);

    expect(await service.isReferenced('/uploads/abc.jpg')).toBe(false);
    expect(projectRepo.count).toHaveBeenCalled();
    expect(imageRepo.count).toHaveBeenCalled();
    expect(aboutRepo.count).toHaveBeenCalled();
  });

  it('한 테이블이라도 1 이상이면 true', async () => {
    projectRepo.count.mockResolvedValue(0);
    imageRepo.count.mockResolvedValue(1);
    aboutRepo.count.mockResolvedValue(0);

    expect(await service.isReferenced('/uploads/shared.jpg')).toBe(true);
  });

  it('excludeProjectId 가 있으면 project / image 쿼리에 Not(id)/Not(projectId) 가 전달된다', async () => {
    projectRepo.count.mockResolvedValue(0);
    imageRepo.count.mockResolvedValue(0);
    aboutRepo.count.mockResolvedValue(0);

    await service.isReferenced('/uploads/a.jpg', { excludeProjectId: 5 });

    const projectWhere = projectRepo.count.mock.calls[0][0]?.where as Record<string, unknown>;
    const imageWhere = imageRepo.count.mock.calls[0][0]?.where as Record<string, unknown>;
    expect(projectWhere.thumbnailImg).toBe('/uploads/a.jpg');
    expect(projectWhere.id).toBeDefined();
    expect(imageWhere.img).toBe('/uploads/a.jpg');
    expect(imageWhere.projectId).toBeDefined();
  });

  it('excludeAboutId 가 있으면 about 쿼리에 Not(id) 가 전달된다', async () => {
    projectRepo.count.mockResolvedValue(0);
    imageRepo.count.mockResolvedValue(0);
    aboutRepo.count.mockResolvedValue(0);

    await service.isReferenced('/uploads/a.jpg', { excludeAboutId: 1 });

    const aboutWhere = aboutRepo.count.mock.calls[0][0]?.where as Record<string, unknown>;
    expect(aboutWhere.profileImage).toBe('/uploads/a.jpg');
    expect(aboutWhere.id).toBeDefined();
  });
});
