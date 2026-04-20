import { Inject, Injectable } from '@nestjs/common';
import { IToeicTestRepository, TOEIC_TEST_REPOSITORY } from '../../domain/toeic.repository.interface';

@Injectable()
export class GetToeicTestsUseCase {
  constructor(
    @Inject(TOEIC_TEST_REPOSITORY) private readonly repo: IToeicTestRepository,
  ) {}

  execute() {
    return this.repo.findAll(true);
  }
}
