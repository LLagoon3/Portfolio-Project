import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AboutProfile } from './about-profile.entity';

@Entity('ABOUT_SOCIAL')
export class AboutSocial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  label!: string;

  @Column({ length: 500 })
  url!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => AboutProfile, (profile) => profile.socials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: AboutProfile;

  @Column({ name: 'profile_id', type: 'tinyint' })
  profileId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
