import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AboutProfile } from './about-profile.entity';

@Entity('ABOUT_BIO')
export class AboutBio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  paragraph!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => AboutProfile, (profile) => profile.bios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: AboutProfile;

  @Column({ name: 'profile_id', type: 'tinyint' })
  profileId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
