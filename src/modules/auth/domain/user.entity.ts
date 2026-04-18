import { Email } from './email.vo';

export type UserRole = 'user' | 'admin' | 'super_admin';
export type UserLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced';

export class User {
  id!: string;
  email!: Email;
  passwordHash!: string | null;
  fullName!: string;
  role!: UserRole;
  currentLevel!: UserLevel;
  streakDays!: number;
  totalXp!: number;
  dailyGoal!: number;
  googleId!: string | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static create(params: {
    id: string;
    email: string;
    passwordHash: string | null;
    fullName: string;
    googleId?: string;
  }): User {
    const user = new User();
    user.id = params.id;
    user.email = new Email(params.email);
    user.passwordHash = params.passwordHash;
    user.fullName = params.fullName;
    user.role = 'user';
    user.currentLevel = 'beginner';
    user.streakDays = 0;
    user.totalXp = 0;
    user.dailyGoal = 20;
    user.googleId = params.googleId ?? null;
    user.isActive = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }
}
