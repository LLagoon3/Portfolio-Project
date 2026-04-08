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

  @Column({ length: 200 })
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.PENDING })
  status!: ContactStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
