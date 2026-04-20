export type ToeicPartNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class ToeicTest {
  id!: string;
  title!: string;
  description!: string;
  year!: number | null;
  isPublished!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ToeicGroup {
  id!: string;
  testId!: string;
  partNumber!: ToeicPartNumber;
  passageText!: string | null;
  audioUrl!: string | null;
  imageUrl!: string | null;
  orderIndex!: number;
}

export class ToeicQuestion {
  id!: string;
  groupId!: string;
  content!: string;
  choices!: string[];
  correctAnswer!: number;
  explanation!: string | null;
  orderIndex!: number;
}

export class ToeicResult {
  id!: string;
  userId!: string;
  testId!: string;
  listeningScore!: number;
  readingScore!: number;
  totalScore!: number;
  correctCount!: number;
  totalCount!: number;
  answers!: Record<string, { userAnswer: number; correctAnswer: number; isCorrect: boolean }>;
  completedAt!: Date;
}
