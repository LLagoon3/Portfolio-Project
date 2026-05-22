import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ContactStatus {
  PENDING = 'pending',
  READ = 'read',
  REPLIED = 'replied',
}

@Entity('CONTACT_SUBMISSION')
export class ContactSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  // Bold form 은 subject 를 수집하지 않으므로 nullable. 기존 ContactForm 의 자유
  // 입력 subject 와 후방 호환 — admin Inbox 에서는 둘 다 표시 가능.
  @Column({ type: 'varchar', length: 200, nullable: true })
  subject!: string | null;

  // Bold form 의 topic chip 선택값. 기존 form 에서는 빈 값 (null).
  @Column({ type: 'varchar', length: 50, nullable: true })
  topic!: string | null;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.PENDING })
  status!: ContactStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
