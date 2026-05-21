import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AboutProfile } from './about-profile.entity';

@Entity('ABOUT_JOURNEY')
export class AboutJourney {
  @PrimaryGeneratedColumn()
  id!: number;

  // 자유 표현. "2026.01 — Now" / "2019.03 — 2025.02" 등.
  @Column({ length: 100 })
  year!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  role!: string | null;

  @Column({ type: 'text' })
  body!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => AboutProfile, (profile) => profile.journeys, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: AboutProfile;

  @Column({ name: 'profile_id', type: 'tinyint' })
  profileId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
