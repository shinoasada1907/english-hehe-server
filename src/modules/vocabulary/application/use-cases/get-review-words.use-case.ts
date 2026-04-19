import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { IVocabularyRepository, VOCABULARY_REPOSITORY } from '../../domain/vocabulary.repository.interface';
import { IUserVocabProgressRepository, USER_VOCAB_PROGRESS_REPOSITORY } from '../../domain/user-vocab-progress.repository.interface';

export interface ReviewWordOutput {
  id: string;
  word: string;
  ipa: string;
  definitionVi: string;
  definitionEn: string;
  exampleSentence: string;
  audioUrl: string;
  imageUrl: string | null;
  level: string;
  wordType: string;
  progress: {
    status: string;
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
    nextReviewAt: Date;
    lastReviewedAt: Date | null;
  };
}

@Injectable()
export class GetReviewWordsUseCase implements IUseCase<string, ReviewWordOutput[]> {
  constructor(
    @Inject(VOCABULARY_REPOSITORY) private readonly vocabRepo: IVocabularyRepository,
    @Inject(USER_VOCAB_PROGRESS_REPOSITORY) private readonly progressRepo: IUserVocabProgressRepository,
  ) {}

  async execute(userId: string): Promise<ReviewWordOutput[]> {
    const progressList = await this.progressRepo.findDueForReview(userId);
    if (progressList.length === 0) return [];

    const vocabIds = progressList.map((p) => p.vocabularyId);
    const vocabularies = await this.vocabRepo.findByIds(vocabIds);
    const vocabMap = new Map(vocabularies.map((v) => [v.id, v]));

    return progressList
      .map((p) => {
        const vocab = vocabMap.get(p.vocabularyId);
        if (!vocab) return null;
        return {
          id: vocab.id,
          word: vocab.word,
          ipa: vocab.ipa,
          definitionVi: vocab.definitionVi,
          definitionEn: vocab.definitionEn,
          exampleSentence: vocab.exampleSentence,
          audioUrl: vocab.audioUrl,
          imageUrl: vocab.imageUrl,
          level: vocab.level,
          wordType: vocab.wordType,
          progress: {
            status: p.status,
            easeFactor: p.easeFactor,
            intervalDays: p.intervalDays,
            repetitions: p.repetitions,
            nextReviewAt: p.nextReviewAt,
            lastReviewedAt: p.lastReviewedAt,
          },
        };
      })
      .filter(Boolean) as ReviewWordOutput[];
  }
}
