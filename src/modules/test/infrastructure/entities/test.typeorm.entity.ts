import { Column, Entity, Index } from 'typeorm';
import { BaseTypeormEntity } from '@database/base.typeorm.entity';

@Entity('tests')
export class TestTypeormEntity extends BaseTypeormEntity {
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

  @Column({ name: 'time_limit', default: 30 })
  timeLimit!: number;

  @Column({ name: 'max_xp', default: 50 })
  maxXp!: number;

  @Index()
  @Column({ name: 'is_published', default: false })
  isPublished!: boolean;
}
