import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectTechnology } from './project-technology.entity';

@Entity('PROJECT_TECHNOLOGY_ITEM')
export class ProjectTechnologyItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => ProjectTechnology, (tech) => tech.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'technology_id' })
  technology!: ProjectTechnology;

  @Column({ name: 'technology_id' })
  technologyId!: number;
}
