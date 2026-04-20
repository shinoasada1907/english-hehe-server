import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTypeormEntity } from './infrastructure/entities/test.typeorm.entity';
import { QuestionTypeormEntity } from './infrastructure/entities/question.typeorm.entity';
import { TestResultTypeormEntity } from './infrastructure/entities/test-result.typeorm.entity';
import { TestRepository } from './infrastructure/repositories/test.repository';
import { QuestionRepository } from './infrastructure/repositories/question.repository';
import { TestResultRepository } from './infrastructure/repositories/test-result.repository';
import { TEST_REPOSITORY, QUESTION_REPOSITORY, TEST_RESULT_REPOSITORY } from './domain/test.repository.interface';
import { GetTestsUseCase } from './application/use-cases/get-tests.use-case';
import { GetTestDetailUseCase } from './application/use-cases/get-test-detail.use-case';
import { SubmitTestUseCase } from './application/use-cases/submit-test.use-case';
import { GetTestHistoryUseCase } from './application/use-cases/get-test-history.use-case';
import { TestController } from './presentation/test.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestTypeormEntity, QuestionTypeormEntity, TestResultTypeormEntity]),
    AuthModule,
  ],
  controllers: [TestController],
  providers: [
    { provide: TEST_REPOSITORY, useClass: TestRepository },
    { provide: QUESTION_REPOSITORY, useClass: QuestionRepository },
    { provide: TEST_RESULT_REPOSITORY, useClass: TestResultRepository },
    GetTestsUseCase,
    GetTestDetailUseCase,
    SubmitTestUseCase,
    GetTestHistoryUseCase,
  ],
})
export class TestModule {}
