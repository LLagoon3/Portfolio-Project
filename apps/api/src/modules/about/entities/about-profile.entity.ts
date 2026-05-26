import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AboutBio } from './about-bio.entity';
import { AboutStat } from './about-stat.entity';
import { AboutPrinciple } from './about-principle.entity';
import { AboutJourney } from './about-journey.entity';
import { AboutSocial } from './about-social.entity';
import { AboutFaq } from './about-faq.entity';

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

  // Bold 리디자인 후속 — Hero status 한 줄, Tech Stack 단순 string 배열.
  @Column({ type: 'varchar', length: 255, nullable: true })
  availability!: string | null;

  // json 타입으로 단순 string[] 저장. 8개 정도라 별도 테이블 오버킬.
  @Column({ type: 'json', nullable: true })
  stacks!: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => AboutBio, (bio) => bio.profile, { cascade: true })
  bios!: AboutBio[];

  @OneToMany(() => AboutStat, (stat) => stat.profile, { cascade: true })
  stats!: AboutStat[];

  @OneToMany(() => AboutPrinciple, (p) => p.profile, { cascade: true })
  principles!: AboutPrinciple[];

  @OneToMany(() => AboutJourney, (j) => j.profile, { cascade: true })
  journeys!: AboutJourney[];

  // 보류였던 후속 필드 — Contact PR (#94) 의 contactEmail/socials/faqs 중 socials/faqs 만 도입.
  @OneToMany(() => AboutSocial, (s) => s.profile, { cascade: true })
  socials!: AboutSocial[];

  @OneToMany(() => AboutFaq, (f) => f.profile, { cascade: true })
  faqs!: AboutFaq[];
}
