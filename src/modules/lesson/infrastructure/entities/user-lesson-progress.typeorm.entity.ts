import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { LessonTypeormEntity } from './lesson.typeorm.entity';

@Entity('user_lesson_progress')
@Unique(['userId', 'lessonId'])
export class UserLessonProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'lesson_id' })
  lessonId!: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({ default: 0 })
  score!: number;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @ManyToOne(() => UserTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserTypeormEntity;

  @ManyToOne(() => LessonTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: LessonTypeormEntity;
}
