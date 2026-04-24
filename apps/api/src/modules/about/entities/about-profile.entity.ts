import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AboutBio } from './about-bio.entity';

// singleton: ABOUT_PROFILE 은 항상 id = 1 인 단일 row 만 허용한다.
// 앱 레벨 컨벤션만으로는 실수 방지가 부족하므로 CHECK 제약으로 못박는다.
@Entity('ABOUT_PROFILE')
@Check(`\`id\` = 1`)
export class AboutProfile {
  @PrimaryColumn({ type: 'tinyint', default: 1 })
  id: number = 1;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tagline!: string | null;

  @Column({ name: 'profile_image', length: 500 })
  profileImage!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => AboutBio, (bio) => bio.profile, { cascade: true })
  bios!: AboutBio[];
}
