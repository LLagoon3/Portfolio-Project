import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AboutProfile } from './about-profile.entity';

@Entity('ABOUT_FAQ')
export class AboutFaq {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  question!: string;

  // markdown 허용. web 에서 bold-prose 로 렌더.
  @Column({ type: 'text' })
  answer!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToOne(() => AboutProfile, (profile) => profile.faqs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: AboutProfile;

  @Column({ name: 'profile_id', type: 'tinyint' })
  profileId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
