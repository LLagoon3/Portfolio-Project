import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutRepository } from './about.repository';
import { AboutProfile } from './entities/about-profile.entity';

describe('AboutRepository', () => {
  let repository: AboutRepository;
  let typeormRepo: jest.Mocked<Repository<AboutProfile>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutRepository,
        {
          provide: getRepositoryToken(AboutProfile),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(AboutRepository);
    typeormRepo = module.get(getRepositoryToken(AboutProfile));
  });

  it('findProfile: id=1 과 bios relation 옵션을 전달한다', async () => {
    typeormRepo.findOne.mockResolvedValue(null);

    await repository.findProfile();

    expect(typeormRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { bios: true },
    });
  });
});
