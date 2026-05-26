import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('PROJECT_LINK')
export class ProjectLink {
  @PrimaryGeneratedColumn()
  id!: number;

  // admin 이 표시할 라벨 자유 입력 (예: '@LLagoon3', 'Repository ↗', 'Demo ↗').
  @Column({ length: 100 })
  label!: string;

  @Column({ length: 500 })
  url!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Project, (project) => project.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id', type: 'int' })
  projectId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
