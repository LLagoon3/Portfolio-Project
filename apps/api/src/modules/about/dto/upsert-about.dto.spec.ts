import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpsertAboutDto } from './upsert-about.dto';

const base = (overrides: Partial<UpsertAboutDto> = {}): Partial<UpsertAboutDto> => ({
  name: 'Lagoon',
  tagline: 'Backend',
  profileImage: '/images/profile.jpeg',
  bio: ['첫 단락', '두 단락'],
  ...overrides,
});

function build(overrides: Partial<UpsertAboutDto> = {}): UpsertAboutDto {
  return plainToInstance(UpsertAboutDto, base(overrides));
}

describe('UpsertAboutDto', () => {
  it('정상 payload 는 검증 통과', async () => {
    const dto = build();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('name 이 공백-only 이면 trim 후 IsNotEmpty 위반', async () => {
    const dto = build({ name: '   ' });
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'name')?.constraints).toHaveProperty(
      'isNotEmpty',
    );
  });

  it('tagline 이 공백-only 이면 null 로 정규화 (선택 필드)', async () => {
    const dto = build({ tagline: '   ' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.tagline).toBeNull();
  });

  it('bio 의 공백-only 항목은 trim 후 IsNotEmpty 위반', async () => {
    const dto = build({ bio: ['ok', '   '] });
    const errors = await validate(dto);
    const bioErr = errors.find((e) => e.property === 'bio');
    expect(bioErr?.constraints).toHaveProperty('isNotEmpty');
  });

  it('bio 의 앞뒤 공백은 제거되어 저장된다', async () => {
    const dto = build({ bio: ['  단락  '] });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.bio).toEqual(['단락']);
  });

  it('profileImage 공백-only 는 trim 후 IsNotEmpty 위반', async () => {
    const dto = build({ profileImage: '   ' });
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'profileImage')?.constraints).toHaveProperty(
      'isNotEmpty',
    );
  });

  it('address 는 선택 필드로 공백-only 는 null 로 정규화', async () => {
    const dto = build({ address: '   ' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.address).toBeNull();
  });

  it('email 은 형식 검증이 붙고 공백-only 는 null 로 정규화', async () => {
    const blank = build({ email: '   ' });
    expect(await validate(blank)).toHaveLength(0);
    expect(blank.email).toBeNull();

    const invalid = build({ email: 'not-an-email' });
    const errors = await validate(invalid);
    expect(errors.find((e) => e.property === 'email')?.constraints).toHaveProperty(
      'isEmail',
    );

    const ok = build({ email: '  me@example.com  ' });
    expect(await validate(ok)).toHaveLength(0);
    expect(ok.email).toBe('me@example.com');
  });

  it('phone 은 형식 검증 없이 trim 만 적용, 공백-only 는 null', async () => {
    const blank = build({ phone: '   ' });
    expect(await validate(blank)).toHaveLength(0);
    expect(blank.phone).toBeNull();

    const ok = build({ phone: ' +82 10-1234-5678 ' });
    expect(await validate(ok)).toHaveLength(0);
    expect(ok.phone).toBe('+82 10-1234-5678');
  });
});
