import { Lesson, LessonCategory } from '../../domain/lesson.entity';
import { LessonTypeormEntity } from '../entities/lesson.typeorm.entity';

export class LessonMapper {
  static toDomain(orm: LessonTypeormEntity): Lesson {
    const l = new Lesson();
    l.id = orm.id;
    l.title = orm.title;
    l.description = orm.description;
    l.level = orm.level;
    l.category = orm.category as LessonCategory;
    l.contentJson = orm.contentJson;
    l.orderIndex = orm.orderIndex;
    l.xpReward = orm.xpReward;
    l.isPublished = orm.isPublished;
    l.createdAt = orm.createdAt;
    l.updatedAt = orm.updatedAt;
    return l;
  }

  static toPersistence(l: Lesson): Partial<LessonTypeormEntity> {
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      level: l.level,
      category: l.category,
      contentJson: l.contentJson,
      orderIndex: l.orderIndex,
      xpReward: l.xpReward,
      isPublished: l.isPublished,
    };
  }
}
