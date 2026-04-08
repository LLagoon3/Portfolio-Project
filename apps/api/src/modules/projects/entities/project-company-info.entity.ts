import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('PROJECT_COMPANY_INFO')
export class ProjectCompanyInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 500 })
  details!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Project, (project) => project.companyInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id' })
  projectId!: number;
}
