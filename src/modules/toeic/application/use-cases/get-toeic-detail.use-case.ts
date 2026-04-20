import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IToeicTestRepository, TOEIC_TEST_REPOSITORY } from '../../domain/toeic.repository.interface';

@Injectable()
export class GetToeicDetailUseCase {
  constructor(
    @Inject(TOEIC_TEST_REPOSITORY) private readonly repo: IToeicTestRepository,
  ) {}

  async execute(testId: string) {
    const test = await this.repo.findById(testId);
    if (!test) throw new NotFoundException('TOEIC test not found');

    const groups = await this.repo.findGroupsWithQuestions(testId);

    const parts = groups.reduce<Record<number, typeof groups>>((acc, g) => {
      if (!acc[g.partNumber]) acc[g.partNumber] = [];
      acc[g.partNumber].push({
        ...g,
        questions: g.questions.map(({ correctAnswer: _ca, ...q }) => q as typeof q & { correctAnswer: never }),
      });
      return acc;
    }, {});

    return { ...test, parts };
  }
}
