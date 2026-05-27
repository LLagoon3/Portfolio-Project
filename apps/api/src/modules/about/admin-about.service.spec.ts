import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdminAboutService } from './admin-about.service';
import { UpsertAboutDto } from './dto/upsert-about.dto';
import { AboutBio } from './entities/about-bio.entity';
import { AboutProfile } from './entities/about-profile.entity';

describe('AdminAboutService', () => {
  let service: AdminAboutService;
  let profileRepo: jest.Mocked<Repository<AboutProfile>>;
  let txManager: { save: jest.Mock; delete: jest.Mock };
  let dataSource: jest.Mocked<Pick<DataSource, 'transaction'>>;
  let uploadsStorage: { deleteByUrl: jest.Mock };
  let uploadsRefChecker: { isReferenced: jest.Mock };

  beforeEach(async () => {
    txManager = { save: jest.fn(), delete: jest.fn() };
    uploadsStorage = { deleteByUrl: jest.fn().mockResolvedValue(true) };
    uploadsRefChecker = { isReferenced: jest.fn().mockResolvedValue(false) };
    dataSource = {
      transaction: jest
        .fn()
        .mockImplementation(async (cb: (m: typeof txManager) => unknown) =>
          cb(txManager),
        ),
    } as unknown as jest.Mocked<Pick<DataSource, 'transaction'>>;

    const { UploadsStorageService } = await import(
      '../uploads/uploads-storage.service'
    );
    const { UploadsReferenceCheckerService } = await import(
      '../uploads/uploads-reference-checker.service'
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAboutService,
        {
          provide: getRepositoryToken(AboutProfile),
          useValue: {
            findOne: jest.fn(),
          },
        },
        { provide: DataSource, useValue: dataSource },
        { provide: UploadsStorageService, useValue: uploadsStorage },
        {
          provide: UploadsReferenceCheckerService,
          useValue: uploadsRefChecker,
        },
      ],
    }).compile();

    service = module.get(AdminAboutService);
    profileRepo = module.get(getRepositoryToken(AboutProfile));
  });

  const dto: UpsertAboutDto = {
    name: 'Lagoon',
    tagline: 'Backend',
    profileImage: '/images/profile.jpeg',
    bio: ['첫 단락', '두 단락'],
  };

  it('upsert: 기존 bios 전량 삭제 후 profile 재저장', async () => {
    profileRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Lagoon',
      tagline: 'Backend',
      profileImage: '/images/profile.jpeg',
      bios: [
        { id: 1, paragraph: '첫 단락', sortOrder: 0 },
        { id: 2, paragraph: '두 단락', sortOrder: 1 },
      ],
    } as never);

    const result = await service.upsert(dto);

    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    // 자식 삭제 호출 확인
    expect(txManager.delete).toHaveBeenCalledWith(AboutBio, { profileId: 1 });
    // 저장 호출 확인 (AboutProfile + 자식 포함)
    expect(txManager.save).toHaveBeenCalledWith(AboutProfile, expect.any(AboutProfile));
    expect(result.name).toBe('Lagoon');
    expect(result.bio).toEqual(['첫 단락', '두 단락']);
  });

  it('upsert: tagline 이 undefined 이면 null 로 저장한다', async () => {
    profileRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Lagoon',
      tagline: null,
      profileImage: '/p.jpg',
      bios: [],
    } as never);

    const payload: UpsertAboutDto = { ...dto, tagline: undefined, bio: [] };
    const result = await service.upsert(payload);

    const savedEntity = txManager.save.mock.calls[0][1] as AboutProfile;
    expect(savedEntity.tagline).toBeNull();
    expect(result.tagline).toBeNull();
  });

  it('upsert: address/email/phone 값과 null 모두 전달된다', async () => {
    profileRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Lagoon',
      tagline: null,
      profileImage: '/p.jpg',
      address: 'Seoul',
      email: 'me@example.com',
      phone: '+82 10-1234-5678',
      bios: [],
    } as never);

    const payload: UpsertAboutDto = {
      ...dto,
      bio: [],
      address: 'Seoul',
      email: 'me@example.com',
      phone: '+82 10-1234-5678',
    };
    const result = await service.upsert(payload);

    const savedEntity = txManager.save.mock.calls[0][1] as AboutProfile;
    expect(savedEntity.address).toBe('Seoul');
    expect(savedEntity.email).toBe('me@example.com');
    expect(savedEntity.phone).toBe('+82 10-1234-5678');
    expect(result.address).toBe('Seoul');
    expect(result.email).toBe('me@example.com');
    expect(result.phone).toBe('+82 10-1234-5678');
  });

  it('upsert: address/email/phone 생략 시 null 로 저장', async () => {
    profileRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Lagoon',
      tagline: null,
      profileImage: '/p.jpg',
      address: null,
      email: null,
      phone: null,
      bios: [],
    } as never);

    await service.upsert({ ...dto, bio: [] });

    const savedEntity = txManager.save.mock.calls[0][1] as AboutProfile;
    expect(savedEntity.address).toBeNull();
    expect(savedEntity.email).toBeNull();
    expect(savedEntity.phone).toBeNull();
  });

  it('upsert: bio 는 입력 순서대로 sort_order 0..N-1 부여', async () => {
    profileRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Lagoon',
      tagline: null,
      profileImage: '/p.jpg',
      bios: [],
    } as never);

    await service.upsert({ ...dto, bio: ['a', 'b', 'c'] });

    const savedEntity = txManager.save.mock.calls[0][1] as AboutProfile;
    expect(savedEntity.bios.map((b) => b.sortOrder)).toEqual([0, 1, 2]);
    expect(savedEntity.bios.map((b) => b.paragraph)).toEqual(['a', 'b', 'c']);
  });

  it('upsert: 저장 후 profile 이 null 이면 에러', async () => {
    profileRepo.findOne.mockResolvedValue(null);
    await expect(service.upsert(dto)).rejects.toThrow(/saved profile not found/);
  });

  it('upsert: 이전 프로필 URL 이 /uploads 이고 다른 참조가 없으면 삭제', async () => {
    profileRepo.findOne
      .mockResolvedValueOnce({
        id: 1,
        profileImage: '/uploads/old.jpg',
      } as never)
      .mockResolvedValueOnce({
        id: 1,
        name: 'x',
        tagline: null,
        profileImage: '/uploads/new.jpg',
        bios: [],
      } as never);
    uploadsRefChecker.isReferenced.mockResolvedValue(false);

    await service.upsert({ ...dto, profileImage: '/uploads/new.jpg', bio: [] });

    expect(uploadsStorage.deleteByUrl).toHaveBeenCalledWith('/uploads/old.jpg');
  });

  it('upsert: 이전 프로필이 다른 레코드에서 참조 중이면 삭제하지 않는다', async () => {
    profileRepo.findOne
      .mockResolvedValueOnce({
        id: 1,
        profileImage: '/uploads/shared.jpg',
      } as never)
      .mockResolvedValueOnce({
        id: 1,
        name: 'x',
        tagline: null,
        profileImage: '/uploads/new.jpg',
        bios: [],
      } as never);
    uploadsRefChecker.isReferenced.mockResolvedValue(true);

    await service.upsert({ ...dto, profileImage: '/uploads/new.jpg', bio: [] });

    expect(uploadsStorage.deleteByUrl).not.toHaveBeenCalled();
  });

  it('upsert: 이전 URL 이 /images (수동 자산) 이면 건드리지 않음', async () => {
    profileRepo.findOne
      .mockResolvedValueOnce({
        id: 1,
        profileImage: '/images/old.jpg',
      } as never)
      .mockResolvedValueOnce({
        id: 1,
        name: 'x',
        tagline: null,
        profileImage: '/uploads/new.jpg',
        bios: [],
      } as never);

    await service.upsert({ ...dto, profileImage: '/uploads/new.jpg', bio: [] });

    expect(uploadsStorage.deleteByUrl).not.toHaveBeenCalled();
  });
});
