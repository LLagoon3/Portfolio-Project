import { AboutProfile } from '../entities/about-profile.entity';
import { AboutBio } from '../entities/about-bio.entity';
import { toAboutResponseDto } from './about.mapper';

const profile = (overrides: Partial<AboutProfile> = {}): AboutProfile =>
  ({
    id: 1,
    name: 'Lagoon',
    tagline: 'Backend Developer',
    profileImage: '/images/profile.jpeg',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    bios: [],
    ...overrides,
  }) as AboutProfile;

const bio = (paragraph: string, sortOrder: number): AboutBio =>
  ({ id: 0, paragraph, sortOrder, profileId: 1 }) as AboutBio;

describe('toAboutResponseDto', () => {
  it('bios 를 sort_order 오름차순으로 정렬해 bio 배열을 만든다', () => {
    const dto = toAboutResponseDto(
      profile({
        bios: [bio('두번째', 1), bio('첫번째', 0), bio('세번째', 2)],
      }),
    );

    expect(dto.bio).toEqual(['첫번째', '두번째', '세번째']);
  });

  it('bios 가 undefined 여도 빈 배열로 복원한다', () => {
    const dto = toAboutResponseDto(profile({ bios: undefined as never }));
    expect(dto.bio).toEqual([]);
  });

  it('name / tagline / profileImage 를 그대로 복사한다', () => {
    const dto = toAboutResponseDto(
      profile({ name: 'Foo', tagline: null, profileImage: '/p.jpg' }),
    );

    expect(dto.name).toBe('Foo');
    expect(dto.tagline).toBeNull();
    expect(dto.profileImage).toBe('/p.jpg');
  });
});
