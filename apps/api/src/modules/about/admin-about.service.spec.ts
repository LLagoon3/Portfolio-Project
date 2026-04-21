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

  beforeEach(async () => {
    txManager = { save: jest.fn(), delete: jest.fn() };
    dataSource = {
      transaction: jest
        .fn()
        .mockImplementation(async (cb: (m: typeof txManager) => unknown) =>
          cb(txManager),
        ),
    } as unknown as jest.Mocked<Pick<DataSource, 'transaction'>>;

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
});
