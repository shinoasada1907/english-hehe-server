import { Test, TestCategory } from '../../domain/test.entity';
import { TestTypeormEntity } from '../entities/test.typeorm.entity';

export class TestMapper {
  static toDomain(orm: TestTypeormEntity): Test {
    const t = new Test();
    t.id = orm.id;
    t.title = orm.title;
    t.description = orm.description;
    t.level = orm.level;
    t.category = orm.category as TestCategory;
    t.timeLimit = orm.timeLimit;
    t.maxXp = orm.maxXp;
    t.isPublished = orm.isPublished;
    t.createdAt = orm.createdAt;
    t.updatedAt = orm.updatedAt;
    return t;
  }
}
