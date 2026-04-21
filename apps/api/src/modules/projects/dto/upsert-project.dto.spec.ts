import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpsertProjectDto } from './upsert-project.dto';

const validPayload = (overrides: Partial<UpsertProjectDto> = {}) => ({
  title: 'Demo',
  url: 'demo',
  category: 'Web Application',
  thumbnailImg: '/img.jpg',
  headerPublishDate: '2026.01',
  headerTags: 'Web',
  clientHeading: 'About Project',
  objectivesHeading: 'Objective',
  objectivesDetails: 'details',
  projectDetailsHeading: 'Challenge',
  images: [{ title: 'a', img: '/a.jpg' }],
  companyInfo: [{ title: 'Role', details: 'Backend' }],
  technologies: [{ title: 'Tools', techs: ['Node.js'] }],
  details: [{ details: '## 본문' }],
  ...overrides,
});

describe('UpsertProjectDto', () => {
  it('정상 payload 는 검증 오류가 없다', async () => {
    const dto = plainToInstance(UpsertProjectDto, validPayload());
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('technologies 가 빈 배열이면 ArrayMinSize 위반', async () => {
    const dto = plainToInstance(
      UpsertProjectDto,
      validPayload({ technologies: [] }),
    );
    const errors = await validate(dto);
    const tech = errors.find((e) => e.property === 'technologies');
    expect(tech?.constraints).toHaveProperty('arrayMinSize');
  });

  it('techs 항목 길이가 100 을 넘으면 검증 실패', async () => {
    const longTech = 'a'.repeat(101);
    const dto = plainToInstance(
      UpsertProjectDto,
      validPayload({
        technologies: [{ title: 'Tools', techs: [longTech] }],
      }),
    );
    const errors = await validate(dto);
    // 상위 technologies 에러에서 nested TechnologyGroup 의 techs 제약 위반을 찾는다
    const tech = errors.find((e) => e.property === 'technologies');
    const flatten = JSON.stringify(tech?.children ?? tech);
    expect(flatten).toContain('maxLength');
  });

  it('기본 필수 필드가 비어있으면 검증 실패', async () => {
    const dto = plainToInstance(UpsertProjectDto, validPayload({ title: '' }));
    const errors = await validate(dto);
    const title = errors.find((e) => e.property === 'title');
    expect(title?.constraints).toHaveProperty('isNotEmpty');
  });
});
