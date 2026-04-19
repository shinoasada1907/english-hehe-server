import { UserLessonProgress } from './user-lesson-progress.entity';

export const USER_LESSON_PROGRESS_REPOSITORY = Symbol('IUserLessonProgressRepository');

export interface IUserLessonProgressRepository {
  findByUser(userId: string): Promise<UserLessonProgress[]>;
  findByUserAndLesson(userId: string, lessonId: string): Promise<UserLessonProgress | null>;
  upsert(progress: UserLessonProgress): Promise<UserLessonProgress>;
}
