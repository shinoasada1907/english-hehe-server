import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TestTypeormEntity } from './test.typeorm.entity';

@Entity('questions')
export class QuestionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'test_id' })
  testId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', array: true })
  choices!: string[];

  @Column({ name: 'correct_answer' })
  correctAnswer!: number;

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  @Column({ name: 'order_index', default: 0 })
  orderIndex!: number;

  @ManyToOne(() => TestTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test!: TestTypeormEntity;
}
