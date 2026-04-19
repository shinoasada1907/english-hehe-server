import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyTypeormEntity } from './infrastructure/entities/vocabulary.typeorm.entity';
import { UserVocabularyProgressTypeormEntity } from './infrastructure/entities/user-vocabulary-progress.typeorm.entity';
import { VocabularyRepository } from './infrastructure/vocabulary.repository';
import { UserVocabProgressRepository } from './infrastructure/user-vocab-progress.repository';
import { VOCABULARY_REPOSITORY } from './domain/vocabulary.repository.interface';
import { USER_VOCAB_PROGRESS_REPOSITORY } from './domain/user-vocab-progress.repository.interface';
import { GetDailyWordsUseCase } from './application/use-cases/get-daily-words.use-case';
import { GetReviewWordsUseCase } from './application/use-cases/get-review-words.use-case';
import { MarkWordStatusUseCase } from './application/use-cases/mark-word-status.use-case';
import { GetVocabularyDetailUseCase } from './application/use-cases/get-vocabulary-detail.use-case';
import { SearchVocabularyUseCase } from './application/use-cases/search-vocabulary.use-case';
import { VocabularyController } from './presentation/vocabulary.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VocabularyTypeormEntity, UserVocabularyProgressTypeormEntity]),
    AuthModule,
  ],
  controllers: [VocabularyController],
  providers: [
    { provide: VOCABULARY_REPOSITORY, useClass: VocabularyRepository },
    { provide: USER_VOCAB_PROGRESS_REPOSITORY, useClass: UserVocabProgressRepository },
    GetDailyWordsUseCase,
    GetReviewWordsUseCase,
    MarkWordStatusUseCase,
    GetVocabularyDetailUseCase,
    SearchVocabularyUseCase,
  ],
})
export class VocabularyModule {}
