import { UserVocabularyProgress, ProgressStatus } from '../../domain/user-vocabulary-progress.entity';
import { UserVocabularyProgressTypeormEntity } from '../entities/user-vocabulary-progress.typeorm.entity';

export class UserVocabProgressMapper {
  static toDomain(orm: UserVocabularyProgressTypeormEntity): UserVocabularyProgress {
    const p = new UserVocabularyProgress();
    p.id = orm.id;
    p.userId = orm.userId;
    p.vocabularyId = orm.vocabularyId;
    p.status = orm.status as ProgressStatus;
    p.easeFactor = Number(orm.easeFactor);
    p.intervalDays = orm.intervalDays;
    p.repetitions = orm.repetitions;
    p.nextReviewAt = orm.nextReviewAt;
    p.lastReviewedAt = orm.lastReviewedAt;
    return p;
  }

  static toPersistence(p: UserVocabularyProgress): Partial<UserVocabularyProgressTypeormEntity> {
    return {
      id: p.id,
      userId: p.userId,
      vocabularyId: p.vocabularyId,
      status: p.status,
      easeFactor: p.easeFactor,
      intervalDays: p.intervalDays,
      repetitions: p.repetitions,
      nextReviewAt: p.nextReviewAt,
      lastReviewedAt: p.lastReviewedAt,
    };
  }
}
