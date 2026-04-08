import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { ProjectTechnologyItem } from './project-technology-item.entity';

@Entity('PROJECT_TECHNOLOGY')
export class ProjectTechnology {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => Project, (project) => project.technologies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id' })
  projectId!: number;

  @OneToMany(() => ProjectTechnologyItem, (item) => item.technology, {
    cascade: true,
  })
  items!: ProjectTechnologyItem[];
}
