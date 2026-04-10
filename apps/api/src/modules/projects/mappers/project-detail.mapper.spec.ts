import { Project } from '../entities/project.entity';
import { ProjectImage } from '../entities/project-image.entity';
import { ProjectCompanyInfo } from '../entities/project-company-info.entity';
import { ProjectTechnology } from '../entities/project-technology.entity';
import { ProjectTechnologyItem } from '../entities/project-technology-item.entity';
import { ProjectDetail } from '../entities/project-detail.entity';
import { toProjectDetailDto } from './project-detail.mapper';

const makeImage = (id: number, sortOrder: number, img: string): ProjectImage =>
  ({ id, title: 't', img, sortOrder }) as ProjectImage;

const makeTechItem = (
  id: number,
  sortOrder: number,
  name: string,
): ProjectTechnologyItem =>
  ({ id, name, sortOrder }) as ProjectTechnologyItem;

describe('toProjectDetailDto', () => {
  const project: Project = {
    id: 7,
    url: 'demo',
    title: 'Demo Project',
    category: 'Web Application',
    thumbnailImg: '/thumb.jpg',
    headerPublishDate: 'Jul 26, 2026',
    headerTags: 'UI / Frontend',
    clientHeading: 'About Client',
    objectivesHeading: 'Objective',
    objectivesDetails: 'do things',
    projectDetailsHeading: 'Challenge',
    socialSharingHeading: 'Share This',
    createdAt: new Date(),
    images: [
      makeImage(1, 2, '/c.jpg'),
      makeImage(2, 0, '/a.jpg'),
      makeImage(3, 1, '/b.jpg'),
    ],
    companyInfo: [
      { id: 10, title: 'Name', details: 'Co', sortOrder: 0 } as ProjectCompanyInfo,
    ],
    technologies: [
      {
        id: 100,
        title: 'Tools',
        sortOrder: 0,
        items: [
          makeTechItem(1, 1, 'CSS'),
          makeTechItem(2, 0, 'HTML'),
          makeTechItem(3, 2, 'JS'),
        ],
      } as ProjectTechnology,
    ],
    details: [
      { id: 50, details: 'second', sortOrder: 1 } as ProjectDetail,
      { id: 51, details: 'first', sortOrder: 0 } as ProjectDetail,
    ],
  } as Project;

  it('top-level 필드를 매핑한다 (img ← thumbnailImg)', () => {
    const dto = toProjectDetailDto(project);
    expect(dto.id).toBe(7);
    expect(dto.url).toBe('demo');
    expect(dto.title).toBe('Demo Project');
    expect(dto.category).toBe('Web Application');
    expect(dto.img).toBe('/thumb.jpg');
  });

  it('ProjectHeader.title 은 Project.title 과 동일하게 채운다', () => {
    const dto = toProjectDetailDto(project);
    expect(dto.ProjectHeader).toEqual({
      title: 'Demo Project',
      publishDate: 'Jul 26, 2026',
      tags: 'UI / Frontend',
    });
  });

  it('ProjectImages 는 sortOrder 오름차순으로 정렬된다', () => {
    const dto = toProjectDetailDto(project);
    expect(dto.ProjectImages.map((i) => i.img)).toEqual([
      '/a.jpg',
      '/b.jpg',
      '/c.jpg',
    ]);
  });

  it('Technologies.techs 는 item.sortOrder 순서로 펼친다', () => {
    const dto = toProjectDetailDto(project);
    expect(dto.ProjectInfo.Technologies[0].techs).toEqual([
      'HTML',
      'CSS',
      'JS',
    ]);
  });

  it('ProjectDetails 는 sortOrder 오름차순으로 정렬된다', () => {
    const dto = toProjectDetailDto(project);
    expect(dto.ProjectInfo.ProjectDetails.map((d) => d.details)).toEqual([
      'first',
      'second',
    ]);
  });

  it('관계가 undefined 여도 빈 배열로 안전하게 처리한다', () => {
    const dto = toProjectDetailDto({
      ...project,
      images: undefined as unknown as ProjectImage[],
      companyInfo: undefined as unknown as ProjectCompanyInfo[],
      technologies: undefined as unknown as ProjectTechnology[],
      details: undefined as unknown as ProjectDetail[],
    });
    expect(dto.ProjectImages).toEqual([]);
    expect(dto.ProjectInfo.CompanyInfo).toEqual([]);
    expect(dto.ProjectInfo.Technologies).toEqual([]);
    expect(dto.ProjectInfo.ProjectDetails).toEqual([]);
  });
});
