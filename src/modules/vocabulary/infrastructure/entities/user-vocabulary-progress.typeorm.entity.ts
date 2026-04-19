import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { VocabularyTypeormEntity } from './vocabulary.typeorm.entity';

@Entity('user_vocabulary_progress')
@Unique(['userId', 'vocabularyId'])
export class UserVocabularyProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'vocabulary_id' })
  vocabularyId!: string;

  @Column({ length: 20, default: 'new' })
  status!: string;

  @Column({ name: 'ease_factor', type: 'decimal', precision: 4, scale: 2, default: 2.5 })
  easeFactor!: number;

  @Column({ name: 'interval_days', default: 1 })
  intervalDays!: number;

  @Column({ default: 0 })
  repetitions!: number;

  @Index()
  @Column({ name: 'next_review_at', type: 'timestamptz', default: () => 'now()' })
  nextReviewAt!: Date;

  @Column({ name: 'last_reviewed_at', type: 'timestamptz', nullable: true })
  lastReviewedAt!: Date | null;

  @ManyToOne(() => UserTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserTypeormEntity;

  @ManyToOne(() => VocabularyTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary!: VocabularyTypeormEntity;
}
