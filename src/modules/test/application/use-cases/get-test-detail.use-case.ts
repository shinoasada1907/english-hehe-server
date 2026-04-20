import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ITestRepository, TEST_REPOSITORY, IQuestionRepository, QUESTION_REPOSITORY } from '../../domain/test.repository.interface';

export interface QuestionPublic {
  id: string;
  content: string;
  choices: string[];
  orderIndex: number;
}

export interface TestDetailOutput {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  timeLimit: number;
  maxXp: number;
  questions: QuestionPublic[];
}

@Injectable()
export class GetTestDetailUseCase implements IUseCase<string, TestDetailOutput> {
  constructor(
    @Inject(TEST_REPOSITORY) private readonly testRepo: ITestRepository,
    @Inject(QUESTION_REPOSITORY) private readonly questionRepo: IQuestionRepository,
  ) {}

  async execute(id: string): Promise<TestDetailOutput> {
    const test = await this.testRepo.findById(id);
    if (!test || !test.isPublished) throw new NotFoundException('Test not found');

    const questions = await this.questionRepo.findByTestId(id);

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      level: test.level,
      category: test.category,
      timeLimit: test.timeLimit,
      maxXp: test.maxXp,
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        choices: q.choices,
        orderIndex: q.orderIndex,
        // correctAnswer intentionally omitted
      })),
    };
  }
}
