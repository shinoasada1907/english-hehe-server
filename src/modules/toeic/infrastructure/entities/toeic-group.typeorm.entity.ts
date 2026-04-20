import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ToeicTestTypeormEntity } from './toeic-test.typeorm.entity';
import { ToeicQuestionTypeormEntity } from './toeic-question.typeorm.entity';

@Entity('toeic_groups')
export class ToeicGroupTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'test_id' })
  testId!: string;

  @Column({ name: 'part_number', type: 'smallint' })
  partNumber!: number;

  @Column({ name: 'passage_text', type: 'text', nullable: true })
  passageText!: string | null;

  @Column({ name: 'audio_url', nullable: true, type: 'varchar' })
  audioUrl!: string | null;

  @Column({ name: 'image_url', nullable: true, type: 'varchar' })
  imageUrl!: string | null;

  @Column({ name: 'order_index', default: 0 })
  orderIndex!: number;

  @ManyToOne(() => ToeicTestTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test!: ToeicTestTypeormEntity;

  @OneToMany(() => ToeicQuestionTypeormEntity, (q) => q.group)
  questions!: ToeicQuestionTypeormEntity[];
}
