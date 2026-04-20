import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToeicTestTypeormEntity } from './infrastructure/entities/toeic-test.typeorm.entity';
import { ToeicGroupTypeormEntity } from './infrastructure/entities/toeic-group.typeorm.entity';
import { ToeicQuestionTypeormEntity } from './infrastructure/entities/toeic-question.typeorm.entity';
import { ToeicResultTypeormEntity } from './infrastructure/entities/toeic-result.typeorm.entity';
import { ToeicTestRepository } from './infrastructure/repositories/toeic-test.repository';
import { ToeicResultRepository } from './infrastructure/repositories/toeic-result.repository';
import { TOEIC_TEST_REPOSITORY, TOEIC_RESULT_REPOSITORY } from './domain/toeic.repository.interface';
import { GetToeicTestsUseCase } from './application/use-cases/get-toeic-tests.use-case';
import { GetToeicDetailUseCase } from './application/use-cases/get-toeic-detail.use-case';
import { SubmitToeicUseCase } from './application/use-cases/submit-toeic.use-case';
import { GetToeicHistoryUseCase } from './application/use-cases/get-toeic-history.use-case';
import { ToeicController } from './presentation/toeic.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ToeicTestTypeormEntity,
      ToeicGroupTypeormEntity,
      ToeicQuestionTypeormEntity,
      ToeicResultTypeormEntity,
    ]),
    AuthModule,
  ],
  controllers: [ToeicController],
  providers: [
    { provide: TOEIC_TEST_REPOSITORY, useClass: ToeicTestRepository },
    { provide: TOEIC_RESULT_REPOSITORY, useClass: ToeicResultRepository },
    GetToeicTestsUseCase,
    GetToeicDetailUseCase,
    SubmitToeicUseCase,
    GetToeicHistoryUseCase,
  ],
})
export class ToeicModule {}
