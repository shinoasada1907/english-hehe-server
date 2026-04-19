export type LessonCategory = 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking';

export class Lesson {
  id!: string;
  title!: string;
  description!: string;
  level!: string;
  category!: LessonCategory;
  contentJson!: Record<string, unknown>;
  orderIndex!: number;
  xpReward!: number;
  isPublished!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
