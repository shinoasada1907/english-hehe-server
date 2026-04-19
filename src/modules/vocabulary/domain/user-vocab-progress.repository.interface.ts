import { UserVocabularyProgress } from './user-vocabulary-progress.entity';

export const USER_VOCAB_PROGRESS_REPOSITORY = Symbol('IUserVocabProgressRepository');

export interface IUserVocabProgressRepository {
  findByUserAndVocab(userId: string, vocabularyId: string): Promise<UserVocabularyProgress | null>;
  findDueForReview(userId: string): Promise<UserVocabularyProgress[]>;
  findLearnedVocabIds(userId: string): Promise<string[]>;
  upsert(progress: UserVocabularyProgress): Promise<UserVocabularyProgress>;
}
