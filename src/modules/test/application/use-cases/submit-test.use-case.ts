import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { ITestRepository, TEST_REPOSITORY, IQuestionRepository, QUESTION_REPOSITORY, ITestResultRepository, TEST_RESULT_REPOSITORY } from '../../domain/test.repository.interface';
import { TestResult, AnswerDetail } from '../../domain/test-result.entity';
import { IAuthRepository, AUTH_REPOSITORY } from '@modules/auth/domain/auth.repository.interface';
import { SubmitTestDto } from '../dto/submit-test.dto';

export interface SubmitTestInput {
  userId: string;
  testId: string;
  dto: SubmitTestDto;
}

export interface SubmitTestOutput {
  score: number;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  answers: Record<string, AnswerDetail>;
  completedAt: Date;
}

@Injectable()
export class SubmitTestUseCase implements IUseCase<SubmitTestInput, SubmitTestOutput> {
  constructor(
    @Inject(TEST_REPOSITORY) private readonly testRepo: ITestRepository,
    @Inject(QUESTION_REPOSITORY) private readonly questionRepo: IQuestionRepository,
    @Inject(TEST_RESULT_REPOSITORY) private readonly resultRepo: ITestResultRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
  ) {}

  async execute(input: SubmitTestInput): Promise<SubmitTestOutput> {
    const test = await this.testRepo.findById(input.testId);
    if (!test || !test.isPublished) throw new NotFoundException('Test not found');

    const questions = await this.questionRepo.findByTestId(input.testId);
    if (input.dto.answers.length !== questions.length) {
      throw new BadRequestException(`Expected ${questions.length} answers, got ${input.dto.answers.length}`);
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const answers: Record<string, AnswerDetail> = {};
    let correctCount = 0;

    for (const item of input.dto.answers) {
      const question = questionMap.get(item.questionId);
      if (!question) throw new BadRequestException(`Unknown questionId: ${item.questionId}`);

      const isCorrect = item.answer === question.correctAnswer;
      if (isCorrect) correctCount++;

      answers[item.questionId] = {
        userAnswer: item.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    }

    const totalCount = questions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    const xpEarned = Math.round((score / 100) * test.maxXp);

    const result = new TestResult();
    result.id = randomUUID();
    result.userId = input.userId;
    result.testId = input.testId;
    result.score = score;
    result.correctCount = correctCount;
    result.totalCount = totalCount;
    result.xpEarned = xpEarned;
    result.answers = answers;
    result.completedAt = new Date();

    const saved = await this.resultRepo.save(result);

    const user = await this.authRepo.findById(input.userId);
    if (user) {
      user.totalXp += xpEarned;
      await this.authRepo.update(user);
    }

    return {
      score: saved.score,
      correctCount: saved.correctCount,
      totalCount: saved.totalCount,
      xpEarned: saved.xpEarned,
      answers: saved.answers,
      completedAt: saved.completedAt,
    };
  }
}
