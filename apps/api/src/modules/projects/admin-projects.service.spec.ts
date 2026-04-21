import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdminProjectsService } from './admin-projects.service';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { Project } from './entities/project.entity';

type DSMock = jest.Mocked<
  Pick<DataSource, 'transaction'>
>;

const baseDto = (overrides: Partial<UpsertProjectDto> = {}): UpsertProjectDto =>
  ({
    title: 'T',
    url: 'new-slug',
    category: 'Web Application',
    thumbnailImg: '/img.jpg',
    headerPublishDate: '2026',
    headerTags: 'UI',
    clientHeading: 'Client',
    objectivesHeading: 'Goal',
    objectivesDetails: 'details',
    projectDetailsHeading: 'Challenge',
    images: [{ title: 'A', img: '/a.jpg' }],
    companyInfo: [{ title: 'Name', details: 'ACME' }],
    technologies: [{ title: 'Stack', techs: ['Node'] }],
    details: [{ details: '## 본문' }],
    ...overrides,
  }) as UpsertProjectDto;

const baseProject = (overrides: Partial<Project> = {}): Project =>
  ({
    id: 1,
    url: 'existing',
    title: 'Existing',
    category: 'Web Application',
    thumbnailImg: '/x.jpg',
    headerPublishDate: '2026',
    headerTags: 'UI',
    clientHeading: 'Client',
    objectivesHeading: 'Goal',
    objectivesDetails: 'd',
    projectDetailsHeading: 'Challenge',
    socialSharingHeading: 'Share',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    images: [],
    companyInfo: [],
    technologies: [],
    details: [],
    ...overrides,
  }) as Project;

describe('AdminProjectsService', () => {
  let service: AdminProjectsService;
  let projectRepo: jest.Mocked<Repository<Project>>;
  let dataSource: DSMock;
  let txManager: { save: jest.Mock; delete: jest.Mock; find: jest.Mock };
  let uploadsStorage: { deleteByUrl: jest.Mock };

  beforeEach(async () => {
    txManager = { save: jest.fn(), delete: jest.fn(), find: jest.fn() };
    uploadsStorage = { deleteByUrl: jest.fn().mockResolvedValue(true) };

    dataSource = {
      transaction: jest
        .fn()
        .mockImplementation(async (cb: (m: typeof txManager) => unknown) =>
          cb(txManager),
        ),
    } as unknown as DSMock;

    const { UploadsStorageService } = await import(
      '../uploads/uploads-storage.service'
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: DataSource, useValue: dataSource },
        { provide: UploadsStorageService, useValue: uploadsStorage },
      ],
    }).compile();

    service = module.get(AdminProjectsService);
    projectRepo = module.get(getRepositoryToken(Project));
  });

  describe('getById', () => {
    it('존재하면 DTO 반환', async () => {
      projectRepo.findOne.mockResolvedValue(baseProject({ id: 1, url: 'demo' }));
      const dto = await service.getById(1);
      expect(dto.url).toBe('demo');
    });

    it('없으면 NotFoundException', async () => {
      projectRepo.findOne.mockResolvedValue(null);
      await expect(service.getById(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('slug 이미 사용 중이면 ConflictException', async () => {
      projectRepo.findOne.mockResolvedValueOnce(baseProject({ url: 'new-slug' }));
      await expect(service.create(baseDto())).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('성공하면 transaction 안에서 save 후 relations 로드해 DTO 반환', async () => {
      projectRepo.findOne
        .mockResolvedValueOnce(null) // assertUrlAvailable
        .mockResolvedValueOnce(baseProject({ id: 10, url: 'new-slug', title: 'T' })); // findOneWithRelations

      txManager.save.mockImplementation(async (_entity, project) => ({
        ...project,
        id: 10,
      }));

      const dto = await service.create(baseDto());

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(txManager.save).toHaveBeenCalledTimes(1);
      expect(dto.url).toBe('new-slug');
      expect(dto.id).toBe(10);
    });
  });

  describe('update', () => {
    it('대상 없으면 NotFoundException', async () => {
      projectRepo.findOne.mockResolvedValue(null);
      await expect(service.update(99, baseDto())).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('slug 변경 시 다른 프로젝트에서 사용 중이면 ConflictException', async () => {
      projectRepo.findOne
        .mockResolvedValueOnce(baseProject({ id: 5, url: 'current' })) // exists
        .mockResolvedValueOnce(baseProject({ id: 7, url: 'new-slug' })); // collision

      await expect(
        service.update(5, baseDto({ url: 'new-slug' })),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('정상 경로: 자식 관계 전부 삭제 후 재저장', async () => {
      projectRepo.findOne
        .mockResolvedValueOnce(baseProject({ id: 5, url: 'new-slug' })) // exists (same url → assertUrlAvailable 생략)
        .mockResolvedValueOnce(baseProject({ id: 5, url: 'new-slug' })); // findOneWithRelations

      txManager.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await service.update(5, baseDto({ url: 'new-slug' }));

      // 자식 삭제 순서 확인
      const deleteCalls = txManager.delete.mock.calls.map((c) => c[0].name ?? c[0]);
      expect(deleteCalls).toContain('ProjectTechnologyItem');
      expect(deleteCalls).toContain('ProjectTechnology');
      expect(deleteCalls).toContain('ProjectImage');
      expect(deleteCalls).toContain('ProjectCompanyInfo');
      expect(deleteCalls).toContain('ProjectDetail');
      // 최종 save 호출
      expect(txManager.save).toHaveBeenCalledTimes(1);
    });

    it('TechnologyItem 은 tech 그룹이 없으면 삭제 건너뛴다', async () => {
      projectRepo.findOne
        .mockResolvedValueOnce(baseProject({ id: 5, url: 'new-slug' }))
        .mockResolvedValueOnce(baseProject({ id: 5, url: 'new-slug' }));
      txManager.find.mockResolvedValue([]);

      await service.update(5, baseDto({ url: 'new-slug' }));

      const deleteCalls = txManager.delete.mock.calls.map((c) => c[0].name ?? c[0]);
      expect(deleteCalls).not.toContain('ProjectTechnologyItem');
    });
  });

  describe('remove', () => {
    it('대상 없으면 NotFoundException', async () => {
      projectRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(10)).rejects.toBeInstanceOf(NotFoundException);
      expect(projectRepo.delete).not.toHaveBeenCalled();
    });

    it('정상 경로: delete 호출 + uploads 파일 정리', async () => {
      projectRepo.findOne.mockResolvedValue(
        baseProject({
          id: 10,
          url: 'to-remove',
          thumbnailImg: '/uploads/thumb.jpg',
          images: [
            { id: 1, title: 'a', img: '/uploads/g1.jpg', sortOrder: 0, projectId: 10 },
            { id: 2, title: 'b', img: '/images/legacy.jpg', sortOrder: 1, projectId: 10 },
          ] as never,
        }),
      );
      projectRepo.delete.mockResolvedValue({ affected: 1, raw: {} } as never);

      await expect(service.remove(10)).resolves.toBeUndefined();
      expect(projectRepo.delete).toHaveBeenCalledWith(10);
      // /uploads/* 만 cleanup 대상이 됨 (`/images/*` 는 수동 자산이라 건드리지 않음)
      const removed = uploadsStorage.deleteByUrl.mock.calls.map((c) => c[0]);
      expect(removed.sort()).toEqual(['/uploads/g1.jpg', '/uploads/thumb.jpg']);
    });

    it('affected=0 이면 NotFoundException', async () => {
      projectRepo.findOne.mockResolvedValue(baseProject({ id: 10 }));
      projectRepo.delete.mockResolvedValue({ affected: 0, raw: {} } as never);
      await expect(service.remove(10)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update — uploads cleanup', () => {
    it('교체된 /uploads/* 파일만 삭제 (유지·외부는 건드리지 않음)', async () => {
      const existing = baseProject({
        id: 5,
        url: 'same-slug',
        thumbnailImg: '/uploads/old-thumb.jpg',
        images: [
          { id: 1, title: 'keep', img: '/uploads/keep.jpg', sortOrder: 0, projectId: 5 },
          { id: 2, title: 'drop', img: '/uploads/drop.jpg', sortOrder: 1, projectId: 5 },
          { id: 3, title: 'legacy', img: '/images/legacy.jpg', sortOrder: 2, projectId: 5 },
        ] as never,
      });
      projectRepo.findOne
        .mockResolvedValueOnce(existing) // findOneWithRelations (before update)
        .mockResolvedValueOnce(
          baseProject({ id: 5, url: 'same-slug', thumbnailImg: '/uploads/new-thumb.jpg' }),
        ); // findOneWithRelations (after)
      txManager.find.mockResolvedValue([]);

      await service.update(
        5,
        baseDto({
          url: 'same-slug',
          thumbnailImg: '/uploads/new-thumb.jpg',
          images: [
            { title: 'keep', img: '/uploads/keep.jpg' },
            { title: 'legacy', img: '/images/legacy.jpg' },
          ],
        }),
      );

      const removed = uploadsStorage.deleteByUrl.mock.calls.map((c) => c[0]);
      // 이전 썸네일, 드롭된 갤러리 이미지만 삭제. keep/legacy 는 유지.
      expect(removed.sort()).toEqual([
        '/uploads/drop.jpg',
        '/uploads/old-thumb.jpg',
      ]);
    });
  });
});
