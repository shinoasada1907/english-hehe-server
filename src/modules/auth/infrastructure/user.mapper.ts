import { User } from '../domain/user.entity';
import { Email } from '../domain/email.vo';
import { UserTypeormEntity } from './entities/user.typeorm.entity';

export class UserMapper {
  static toDomain(orm: UserTypeormEntity): User {
    const user = new User();
    user.id = orm.id;
    user.email = new Email(orm.email);
    user.passwordHash = orm.passwordHash;
    user.fullName = orm.fullName;
    user.role = orm.role as User['role'];
    user.currentLevel = orm.currentLevel as User['currentLevel'];
    user.streakDays = orm.streakDays;
    user.totalXp = orm.totalXp;
    user.dailyGoal = orm.dailyGoal;
    user.googleId = orm.googleId;
    user.isActive = orm.isActive;
    user.createdAt = orm.createdAt;
    user.updatedAt = orm.updatedAt;
    return user;
  }

  static toPersistence(user: User): Partial<UserTypeormEntity> {
    return {
      id: user.id,
      email: user.email.toString(),
      passwordHash: user.passwordHash,
      fullName: user.fullName,
      role: user.role,
      currentLevel: user.currentLevel,
      streakDays: user.streakDays,
      totalXp: user.totalXp,
      dailyGoal: user.dailyGoal,
      googleId: user.googleId,
      isActive: user.isActive,
    };
  }
}
