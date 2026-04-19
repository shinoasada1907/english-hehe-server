import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { IVocabularyRepository, VOCABULARY_REPOSITORY } from '../../domain/vocabulary.repository.interface';
import { IUserVocabProgressRepository, USER_VOCAB_PROGRESS_REPOSITORY } from '../../domain/user-vocab-progress.repository.interface';
import { UserVocabularyProgress, ProgressStatus } from '../../domain/user-vocabulary-progress.entity';
import { Sm2Service } from '../../domain/services/sm2.service';
import { RedisService } from '../../../../redis/redis.service';

export interface MarkWordStatusInput {
  userId: string;
  vocabularyId: string;
  quality: number;
}

export interface MarkWordStatusOutput {
  vocabularyId: string;
  status: ProgressStatus;
  nextReviewAt: Date;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

@Injectable()
export class MarkWordStatusUseCase implements IUseCase<MarkWordStatusInput, MarkWordStatusOutput> {
  constructor(
    @Inject(VOCABULARY_REPOSITORY) private readonly vocabRepo: IVocabularyRepository,
    @Inject(USER_VOCAB_PROGRESS_REPOSITORY) private readonly progressRepo: IUserVocabProgressRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(input: MarkWordStatusInput): Promise<MarkWordStatusOutput> {
    const vocab = await this.vocabRepo.findById(input.vocabularyId);
    if (!vocab) throw new NotFoundException('Vocabulary not found');

    let progress = await this.progressRepo.findByUserAndVocab(input.userId, input.vocabularyId);

    if (!progress) {
      progress = new UserVocabularyProgress();
      progress.id = randomUUID();
      progress.userId = input.userId;
      progress.vocabularyId = input.vocabularyId;
      progress.easeFactor = 2.5;
      progress.intervalDays = 1;
      progress.repetitions = 0;
      progress.status = 'new';
      progress.nextReviewAt = new Date();
      progress.lastReviewedAt = null;
    }

    const sm2 = Sm2Service.calculate({
      easeFactor: progress.easeFactor,
      intervalDays: progress.intervalDays,
      repetitions: progress.repetitions,
      quality: input.quality,
    });

    progress.easeFactor = sm2.easeFactor;
    progress.intervalDays = sm2.intervalDays;
    progress.repetitions = sm2.repetitions;
    progress.nextReviewAt = sm2.nextReviewAt;
    progress.status = sm2.status;
    progress.lastReviewedAt = new Date();

    const saved = await this.progressRepo.upsert(progress);

    const today = new Date().toISOString().slice(0, 10);
    await this.redis.del(`daily_words:${input.userId}:${today}`);

    return {
      vocabularyId: saved.vocabularyId,
      status: saved.status,
      nextReviewAt: saved.nextReviewAt,
      intervalDays: saved.intervalDays,
      easeFactor: saved.easeFactor,
      repetitions: saved.repetitions,
    };
  }
}
