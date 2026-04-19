import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ILessonRepository, LESSON_REPOSITORY } from '../../domain/lesson.repository.interface';
import { IUserLessonProgressRepository, USER_LESSON_PROGRESS_REPOSITORY } from '../../domain/user-lesson-progress.repository.interface';

export interface UserLessonProgressItem {
  lessonId: string;
  title: string;
  level: string;
  category: string;
  completed: boolean;
  score: number;
  completedAt: Date | null;
}

@Injectable()
export class GetUserLessonProgressUseCase implements IUseCase<string, UserLessonProgressItem[]> {
  constructor(
    @Inject(LESSON_REPOSITORY) private readonly lessonRepo: ILessonRepository,
    @Inject(USER_LESSON_PROGRESS_REPOSITORY) private readonly progressRepo: IUserLessonProgressRepository,
  ) {}

  async execute(userId: string): Promise<UserLessonProgressItem[]> {
    const progressList = await this.progressRepo.findByUser(userId);
    if (progressList.length === 0) return [];

    const lessonIds = progressList.map((p) => p.lessonId);
    const lessons = await this.lessonRepo.findByIds(lessonIds);
    const lessonMap = new Map(lessons.map((l) => [l.id, l]));

    return progressList
      .map((p) => {
        const lesson = lessonMap.get(p.lessonId);
        if (!lesson) return null;
        return {
          lessonId: lesson.id,
          title: lesson.title,
          level: lesson.level,
          category: lesson.category,
          completed: p.completed,
          score: p.score,
          completedAt: p.completedAt,
        };
      })
      .filter(Boolean) as UserLessonProgressItem[];
  }
}
