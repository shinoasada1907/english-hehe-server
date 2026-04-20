export interface AnswerDetail {
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export class TestResult {
  id!: string;
  userId!: string;
  testId!: string;
  score!: number;
  correctCount!: number;
  totalCount!: number;
  xpEarned!: number;
  answers!: Record<string, AnswerDetail>;
  completedAt!: Date;
}
