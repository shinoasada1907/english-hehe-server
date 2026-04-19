import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { IVocabularyRepository, VOCABULARY_REPOSITORY } from '../../domain/vocabulary.repository.interface';
import { IUserVocabProgressRepository, USER_VOCAB_PROGRESS_REPOSITORY } from '../../domain/user-vocab-progress.repository.interface';
import { IAuthRepository, AUTH_REPOSITORY } from '@modules/auth/domain/auth.repository.interface';
import { RedisService } from '../../../../redis/redis.service';
import { Vocabulary, VocabLevel } from '../../domain/vocabulary.entity';

const DAILY_LIMIT = 10;
const CACHE_TTL = 3600;

const USER_LEVEL_TO_VOCAB_LEVEL: Record<string, VocabLevel> = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
  upper_intermediate: 'B2',
  advanced: 'C1',
};

export interface GetDailyWordsInput {
  userId: string;
  limit?: number;
}

@Injectable()
export class GetDailyWordsUseCase implements IUseCase<GetDailyWordsInput, Vocabulary[]> {
  constructor(
    @Inject(VOCABULARY_REPOSITORY) private readonly vocabRepo: IVocabularyRepository,
    @Inject(USER_VOCAB_PROGRESS_REPOSITORY) private readonly progressRepo: IUserVocabProgressRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(input: GetDailyWordsInput): Promise<Vocabulary[]> {
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `daily_words:${input.userId}:${today}`;

    const cached = await this.redis.get<Vocabulary[]>(cacheKey);
    if (cached) return cached;

    const user = await this.authRepo.findById(input.userId);
    const vocabLevel = USER_LEVEL_TO_VOCAB_LEVEL[user?.currentLevel ?? 'beginner'] ?? 'A1';

    const learnedIds = await this.progressRepo.findLearnedVocabIds(input.userId);
    const words = await this.vocabRepo.findByLevelExcluding(vocabLevel, learnedIds, input.limit ?? DAILY_LIMIT);

    await this.redis.set(cacheKey, words, CACHE_TTL);
    return words;
  }
}
