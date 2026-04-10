import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('PROJECT_DETAIL')
export class ProjectDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  details!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Project, (project) => project.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id' })
  projectId!: number;
}
