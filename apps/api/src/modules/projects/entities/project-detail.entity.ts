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

  // Phase 2 후속 (PR #113) — Process step 의 chip label + 헤딩. 미입력 시 web 에서
  // 기존 markdown h2 split + 키워드 매칭 폴백 (parseProcessSteps).
  @Column({ type: 'varchar', length: 50, nullable: true })
  kind!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title!: string | null;

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
