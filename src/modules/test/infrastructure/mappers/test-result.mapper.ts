import { TestResult } from '../../domain/test-result.entity';
import { TestResultTypeormEntity } from '../entities/test-result.typeorm.entity';

export class TestResultMapper {
  static toDomain(orm: TestResultTypeormEntity): TestResult {
    const r = new TestResult();
    r.id = orm.id;
    r.userId = orm.userId;
    r.testId = orm.testId;
    r.score = orm.score;
    r.correctCount = orm.correctCount;
    r.totalCount = orm.totalCount;
    r.xpEarned = orm.xpEarned;
    r.answers = orm.answers;
    r.completedAt = orm.completedAt;
    return r;
  }

  static toPersistence(r: TestResult): Partial<TestResultTypeormEntity> {
    return {
      id: r.id,
      userId: r.userId,
      testId: r.testId,
      score: r.score,
      correctCount: r.correctCount,
      totalCount: r.totalCount,
      xpEarned: r.xpEarned,
      answers: r.answers,
      completedAt: r.completedAt,
    };
  }
}
