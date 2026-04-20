import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { ToeicTestTypeormEntity } from './toeic-test.typeorm.entity';

@Entity('toeic_results')
export class ToeicResultTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'test_id' })
  testId!: string;

  @Column({ name: 'listening_score', default: 0 })
  listeningScore!: number;

  @Column({ name: 'reading_score', default: 0 })
  readingScore!: number;

  @Column({ name: 'total_score', default: 0 })
  totalScore!: number;

  @Column({ name: 'correct_count', default: 0 })
  correctCount!: number;

  @Column({ name: 'total_count', default: 0 })
  totalCount!: number;

  @Column({ type: 'jsonb', default: {} })
  answers!: Record<string, { userAnswer: number; correctAnswer: number; isCorrect: boolean }>;

  @Column({ name: 'completed_at', type: 'timestamptz' })
  completedAt!: Date;

  @ManyToOne(() => UserTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserTypeormEntity;

  @ManyToOne(() => ToeicTestTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test!: ToeicTestTypeormEntity;
}
