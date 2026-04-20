import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { TestTypeormEntity } from './test.typeorm.entity';
import { AnswerDetail } from '../../domain/test-result.entity';

@Entity('test_results')
export class TestResultTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'test_id' })
  testId!: string;

  @Column({ default: 0 })
  score!: number;

  @Column({ name: 'correct_count', default: 0 })
  correctCount!: number;

  @Column({ name: 'total_count', default: 0 })
  totalCount!: number;

  @Column({ name: 'xp_earned', default: 0 })
  xpEarned!: number;

  @Column({ type: 'jsonb', default: {} })
  answers!: Record<string, AnswerDetail>;

  @Index()
  @Column({ name: 'completed_at', type: 'timestamptz' })
  completedAt!: Date;

  @ManyToOne(() => UserTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserTypeormEntity;

  @ManyToOne(() => TestTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test!: TestTypeormEntity;
}
