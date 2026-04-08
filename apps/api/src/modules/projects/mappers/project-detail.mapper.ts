import { Project } from '../entities/project.entity';
import { ProjectDetailDto } from '../dto/project-detail.dto';

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T): number =>
  a.sortOrder - b.sortOrder;

export function toProjectDetailDto(project: Project): ProjectDetailDto {
  const images = [...(project.images ?? [])].sort(bySortOrder);
  const companyInfo = [...(project.companyInfo ?? [])].sort(bySortOrder);
  const technologies = [...(project.technologies ?? [])].sort(bySortOrder);
  const details = [...(project.details ?? [])].sort(bySortOrder);

  return {
    id: project.id,
    title: project.title,
    url: project.url,
    category: project.category,
    img: project.thumbnailImg,
    ProjectHeader: {
      title: project.title,
      publishDate: project.headerPublishDate,
      tags: project.headerTags,
    },
    ProjectImages: images.map((image) => ({
      id: image.id,
      title: image.title,
      img: image.img,
    })),
    ProjectInfo: {
      ClientHeading: project.clientHeading,
      CompanyInfo: companyInfo.map((info) => ({
        id: info.id,
        title: info.title,
        details: info.details,
      })),
      ObjectivesHeading: project.objectivesHeading,
      ObjectivesDetails: project.objectivesDetails,
      Technologies: technologies.map((tech) => ({
        title: tech.title,
        techs: [...(tech.items ?? [])]
          .sort(bySortOrder)
          .map((item) => item.name),
      })),
      ProjectDetailsHeading: project.projectDetailsHeading,
      ProjectDetails: details.map((detail) => ({
        id: detail.id,
        details: detail.details,
      })),
      SocialSharingHeading: project.socialSharingHeading,
    },
  };
}
