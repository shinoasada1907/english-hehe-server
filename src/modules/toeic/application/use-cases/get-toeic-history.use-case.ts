import { Inject, Injectable } from '@nestjs/common';
import { IToeicResultRepository, TOEIC_RESULT_REPOSITORY } from '../../domain/toeic.repository.interface';

@Injectable()
export class GetToeicHistoryUseCase {
  constructor(
    @Inject(TOEIC_RESULT_REPOSITORY) private readonly repo: IToeicResultRepository,
  ) {}

  execute(userId: string) {
    return this.repo.findByUserId(userId);
  }
}
