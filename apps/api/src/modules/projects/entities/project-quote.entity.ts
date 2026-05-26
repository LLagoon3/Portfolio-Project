import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('PROJECT_QUOTE')
export class ProjectQuote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  author!: string | null;

  @OneToOne(() => Project, (project) => project.quote, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id', type: 'int' })
  projectId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
