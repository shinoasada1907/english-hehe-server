import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ITestResultRepository, TEST_RESULT_REPOSITORY } from '../../domain/test.repository.interface';
import { TestResult } from '../../domain/test-result.entity';

@Injectable()
export class GetTestHistoryUseCase implements IUseCase<string, TestResult[]> {
  constructor(
    @Inject(TEST_RESULT_REPOSITORY) private readonly resultRepo: ITestResultRepository,
  ) {}

  async execute(userId: string): Promise<TestResult[]> {
    return this.resultRepo.findByUser(userId);
  }
}
