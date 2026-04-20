export type TestCategory = 'grammar' | 'reading' | 'listening' | 'vocabulary' | 'mixed';

export class Test {
  id!: string;
  title!: string;
  description!: string;
  level!: string;
  category!: TestCategory;
  timeLimit!: number;
  maxXp!: number;
  isPublished!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
