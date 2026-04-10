import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectImage } from './project-image.entity';
import { ProjectCompanyInfo } from './project-company-info.entity';
import { ProjectTechnology } from './project-technology.entity';
import { ProjectDetail } from './project-detail.entity';

@Entity('PROJECT')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 200 })
  url!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ length: 100 })
  category!: string;

  @Column({ name: 'thumbnail_img', length: 500 })
  thumbnailImg!: string;

  @Column({ name: 'header_publish_date', length: 100 })
  headerPublishDate!: string;

  @Column({ name: 'header_tags', length: 200 })
  headerTags!: string;

  @Column({ name: 'client_heading', length: 200 })
  clientHeading!: string;

  @Column({ name: 'objectives_heading', length: 200 })
  objectivesHeading!: string;

  @Column({ name: 'objectives_details', type: 'text' })
  objectivesDetails!: string;

  @Column({ name: 'project_details_heading', length: 200 })
  projectDetailsHeading!: string;

  @Column({ name: 'social_sharing_heading', length: 200 })
  socialSharingHeading!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ProjectImage, (image) => image.project, {
    cascade: true,
  })
  images!: ProjectImage[];

  @OneToMany(() => ProjectCompanyInfo, (info) => info.project, {
    cascade: true,
  })
  companyInfo!: ProjectCompanyInfo[];

  @OneToMany(() => ProjectTechnology, (tech) => tech.project, {
    cascade: true,
  })
  technologies!: ProjectTechnology[];

  @OneToMany(() => ProjectDetail, (detail) => detail.project, {
    cascade: true,
  })
  details!: ProjectDetail[];
}
