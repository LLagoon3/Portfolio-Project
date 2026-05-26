import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectImage } from './project-image.entity';
import { ProjectCompanyInfo } from './project-company-info.entity';
import { ProjectTechnology } from './project-technology.entity';
import { ProjectDetail } from './project-detail.entity';
import { ProjectStat } from './project-stat.entity';
import { ProjectQuote } from './project-quote.entity';
import { ProjectLink } from './project-link.entity';

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

  // Phase 2: Hero 의 큰 타이틀 아래 한 줄 설명. 미입력 시 UI 에서 미노출.
  @Column({ name: 'hero_subtitle', type: 'varchar', length: 255, nullable: true })
  heroSubtitle!: string | null;

  // Phase 2: Hero 타이틀 중 indigo+italic 강조할 단어. 미입력 시 web 에서 title 마지막 토큰 폴백.
  @Column({ name: 'hero_accent_word', type: 'varchar', length: 100, nullable: true })
  heroAccentWord!: string | null;

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

  // Phase 2: Impact (3-stat) 섹션용 OneToMany. AboutStat 패턴 동일.
  @OneToMany(() => ProjectStat, (stat) => stat.project, {
    cascade: true,
  })
  stats!: ProjectStat[];

  // Phase 2: Quote (pull quote) 섹션용 OneToOne. 미존재 시 UI 에서 미노출.
  @OneToOne(() => ProjectQuote, (quote) => quote.project, {
    cascade: true,
  })
  quote!: ProjectQuote | null;

  // Project Links (GitHub / Notion / Demo 등) — Hero meta strip 아래 Direct row 노출.
  @OneToMany(() => ProjectLink, (link) => link.project, {
    cascade: true,
  })
  links!: ProjectLink[];
}
