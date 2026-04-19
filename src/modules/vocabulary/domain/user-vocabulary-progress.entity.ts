export type ProgressStatus = 'new' | 'learning' | 'review' | 'mastered';

export class UserVocabularyProgress {
  id!: string;
  userId!: string;
  vocabularyId!: string;
  status!: ProgressStatus;
  easeFactor!: number;
  intervalDays!: number;
  repetitions!: number;
  nextReviewAt!: Date;
  lastReviewedAt!: Date | null;
}
