import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('toeic_tests')
export class ToeicTestTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ nullable: true, type: 'int' })
  year!: number | null;

  @Column({ name: 'is_published', default: false })
  isPublished!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
