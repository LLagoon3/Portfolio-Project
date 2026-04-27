import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AboutRepository } from './about.repository';
import { AboutService } from './about.service';
import { AboutProfile } from './entities/about-profile.entity';

const baseProfile = (overrides: Partial<AboutProfile> = {}): AboutProfile =>
  ({
    id: 1,
    name: 'Lagoon',
    tagline: 'Backend Developer',
    profileImage: '/images/profile.jpeg',
    address: null,
    email: null,
    phone: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    bios: [
      {
        id: 1,
        paragraph: '두 번째로 보여줄 단락',
        sortOrder: 1,
        profileId: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
      {
        id: 2,
        paragraph: '첫 단락',
        sortOrder: 0,
        profileId: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ],
    ...overrides,
  }) as AboutProfile;

describe('AboutService', () => {
  let service: AboutService;
  let repository: jest.Mocked<AboutRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutService,
        {
          provide: AboutRepository,
          useValue: {
            findProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AboutService);
    repository = module.get(AboutRepository);
  });

  it('get: profile 없으면 NotFoundException 을 던진다', async () => {
    repository.findProfile.mockResolvedValue(null);
    await expect(service.get()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('get: profile 있으면 sort_order 오름차순으로 정리된 DTO 를 반환한다', async () => {
    repository.findProfile.mockResolvedValue(baseProfile());

    const result = await service.get();

    expect(result).toEqual({
      name: 'Lagoon',
      tagline: 'Backend Developer',
      profileImage: '/images/profile.jpeg',
      bio: ['첫 단락', '두 번째로 보여줄 단락'],
      address: null,
      email: null,
      phone: null,
    });
  });

  it('get: tagline 이 null 이어도 그대로 반영한다', async () => {
    repository.findProfile.mockResolvedValue(
      baseProfile({ tagline: null, bios: [] }),
    );

    const result = await service.get();

    expect(result.tagline).toBeNull();
    expect(result.bio).toEqual([]);
  });
});
