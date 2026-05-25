import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('PROJECT_STAT')
export class ProjectStat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  label!: string;

  @Column({ length: 100 })
  value!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sub!: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Project, (project) => project.stats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id', type: 'int' })
  projectId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
