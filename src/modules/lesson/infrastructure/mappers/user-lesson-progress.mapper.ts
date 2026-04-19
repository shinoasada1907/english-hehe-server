import { UserLessonProgress } from '../../domain/user-lesson-progress.entity';
import { UserLessonProgressTypeormEntity } from '../entities/user-lesson-progress.typeorm.entity';

export class UserLessonProgressMapper {
  static toDomain(orm: UserLessonProgressTypeormEntity): UserLessonProgress {
    const p = new UserLessonProgress();
    p.id = orm.id;
    p.userId = orm.userId;
    p.lessonId = orm.lessonId;
    p.completed = orm.completed;
    p.score = orm.score;
    p.completedAt = orm.completedAt;
    return p;
  }

  static toPersistence(p: UserLessonProgress): Partial<UserLessonProgressTypeormEntity> {
    return {
      id: p.id,
      userId: p.userId,
      lessonId: p.lessonId,
      completed: p.completed,
      score: p.score,
      completedAt: p.completedAt,
    };
  }
}
