import { Column, Entity, Index } from 'typeorm';
import { BaseTypeormEntity } from '@database/base.typeorm.entity';

@Entity('users')
export class UserTypeormEntity extends BaseTypeormEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', nullable: true, type: 'varchar' })
  passwordHash!: string | null;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ name: 'current_level', default: 'beginner' })
  currentLevel!: string;

  @Column({ name: 'streak_days', default: 0 })
  streakDays!: number;

  @Column({ name: 'total_xp', default: 0 })
  totalXp!: number;

  @Column({ name: 'daily_goal', default: 20 })
  dailyGoal!: number;

  @Index()
  @Column({ name: 'google_id', nullable: true, unique: true, type: 'varchar' })
  googleId!: string | null;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'last_active_at', nullable: true, type: 'timestamptz' })
  lastActiveAt!: Date | null;
}
