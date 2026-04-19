import { Column, Entity, Index } from 'typeorm';
import { BaseTypeormEntity } from '@database/base.typeorm.entity';

@Entity('lessons')
export class LessonTypeormEntity extends BaseTypeormEntity {
  @Column()
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Index()
  @Column({ length: 10 })
  level!: string;

  @Index()
  @Column({ length: 50 })
  category!: string;

  @Column({ name: 'content_json', type: 'jsonb', default: {} })
  contentJson!: Record<string, unknown>;

  @Column({ name: 'order_index', default: 0 })
  orderIndex!: number;

  @Column({ name: 'xp_reward', default: 10 })
  xpReward!: number;

  @Index()
  @Column({ name: 'is_published', default: false })
  isPublished!: boolean;
}
