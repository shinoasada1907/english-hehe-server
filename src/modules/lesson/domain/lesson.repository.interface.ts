import { Lesson, LessonCategory } from './lesson.entity';

export const LESSON_REPOSITORY = Symbol('ILessonRepository');

export interface LessonFilter {
  level?: string;
  category?: LessonCategory;
}

export interface ILessonRepository {
  findAll(filter: LessonFilter): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  findByIds(ids: string[]): Promise<Lesson[]>;
}
