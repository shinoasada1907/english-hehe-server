export class Question {
  id!: string;
  testId!: string;
  content!: string;
  choices!: string[];
  correctAnswer!: number;
  explanation!: string | null;
  orderIndex!: number;
}
