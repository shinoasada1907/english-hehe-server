import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ITestRepository, TEST_REPOSITORY, TestFilter } from '../../domain/test.repository.interface';
import { Test } from '../../domain/test.entity';

@Injectable()
export class GetTestsUseCase implements IUseCase<TestFilter, Test[]> {
  constructor(
    @Inject(TEST_REPOSITORY) private readonly testRepo: ITestRepository,
  ) {}

  async execute(filter: TestFilter): Promise<Test[]> {
    return this.testRepo.findAll(filter);
  }
}
