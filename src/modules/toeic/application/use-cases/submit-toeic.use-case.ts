import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IToeicTestRepository, IToeicResultRepository, TOEIC_TEST_REPOSITORY, TOEIC_RESULT_REPOSITORY } from '../../domain/toeic.repository.interface';
import { SubmitToeicDto } from '../dto/submit-toeic.dto';

// Parts 1-4 = Listening (100 questions), Parts 5-7 = Reading (100 questions)
// Scale: 0-100 correct → 5-495 per section (simplified linear scaling)
const LISTENING_PARTS = new Set([1, 2, 3, 4]);

function scaleScore(correct: number, total: number): number {
  if (total === 0) return 5;
  const raw = (correct / total) * 490 + 5;
  return Math.min(495, Math.round(raw / 5) * 5);
}

@Injectable()
export class SubmitToeicUseCase {
  constructor(
    @Inject(TOEIC_TEST_REPOSITORY) private readonly testRepo: IToeicTestRepository,
    @Inject(TOEIC_RESULT_REPOSITORY) private readonly resultRepo: IToeicResultRepository,
  ) {}

  async execute(userId: string, testId: string, dto: SubmitToeicDto) {
    const test = await this.testRepo.findById(testId);
    if (!test) throw new NotFoundException('TOEIC test not found');

    const groups = await this.testRepo.findGroupsWithQuestions(testId);
    const questionMap = new Map(
      groups.flatMap((g) => g.questions.map((q) => [q.id, { ...q, partNumber: g.partNumber }])),
    );

    if (dto.answers.length !== questionMap.size) {
      throw new BadRequestException(
        `Expected ${questionMap.size} answers, got ${dto.answers.length}`,
      );
    }

    let listeningCorrect = 0;
    let listeningTotal = 0;
    let readingCorrect = 0;
    let readingTotal = 0;
    const answers: Record<string, { userAnswer: number; correctAnswer: number; isCorrect: boolean }> = {};

    for (const a of dto.answers) {
      const q = questionMap.get(a.questionId);
      if (!q) throw new BadRequestException(`Unknown questionId: ${a.questionId}`);
      const isCorrect = a.answer === q.correctAnswer;
      answers[a.questionId] = { userAnswer: a.answer, correctAnswer: q.correctAnswer, isCorrect };

      if (LISTENING_PARTS.has(q.partNumber)) {
        listeningTotal++;
        if (isCorrect) listeningCorrect++;
      } else {
        readingTotal++;
        if (isCorrect) readingCorrect++;
      }
    }

    const listeningScore = scaleScore(listeningCorrect, listeningTotal);
    const readingScore = scaleScore(readingCorrect, readingTotal);

    const result = await this.resultRepo.save({
      id: uuidv4(),
      userId,
      testId,
      listeningScore,
      readingScore,
      totalScore: listeningScore + readingScore,
      correctCount: listeningCorrect + readingCorrect,
      totalCount: questionMap.size,
      answers,
      completedAt: new Date(),
    });

    return {
      listeningScore,
      readingScore,
      totalScore: result.totalScore,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
    };
  }
}
