import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ToeicGroupTypeormEntity } from './toeic-group.typeorm.entity';

@Entity('toeic_questions')
export class ToeicQuestionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'group_id' })
  groupId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', array: true })
  choices!: string[];

  @Column({ name: 'correct_answer', type: 'smallint' })
  correctAnswer!: number;

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  @Column({ name: 'order_index', default: 0 })
  orderIndex!: number;

  @ManyToOne(() => ToeicGroupTypeormEntity, (g) => g.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group!: ToeicGroupTypeormEntity;
}
