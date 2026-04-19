export class UserLessonProgress {
  id!: string;
  userId!: string;
  lessonId!: string;
  completed!: boolean;
  score!: number;
  completedAt!: Date | null;
}
