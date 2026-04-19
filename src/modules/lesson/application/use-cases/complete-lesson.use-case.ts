import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { ILessonRepository, LESSON_REPOSITORY } from '../../domain/lesson.repository.interface';
import { IUserLessonProgressRepository, USER_LESSON_PROGRESS_REPOSITORY } from '../../domain/user-lesson-progress.repository.interface';
import { UserLessonProgress } from '../../domain/user-lesson-progress.entity';
import { IAuthRepository, AUTH_REPOSITORY } from '@modules/auth/domain/auth.repository.interface';

export interface CompleteLessonInput {
  userId: string;
  lessonId: string;
  score: number;
}

export interface CompleteLessonOutput {
  lessonId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  completedAt: Date | null;
}

@Injectable()
export class CompleteLessonUseCase implements IUseCase<CompleteLessonInput, CompleteLessonOutput> {
  constructor(
    @Inject(LESSON_REPOSITORY) private readonly lessonRepo: ILessonRepository,
    @Inject(USER_LESSON_PROGRESS_REPOSITORY) private readonly progressRepo: IUserLessonProgressRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
  ) {}

  async execute(input: CompleteLessonInput): Promise<CompleteLessonOutput> {
    const lesson = await this.lessonRepo.findById(input.lessonId);
    if (!lesson || !lesson.isPublished) throw new NotFoundException('Lesson not found');

    let progress = await this.progressRepo.findByUserAndLesson(input.userId, input.lessonId);

    if (progress?.completed) {
      return {
        lessonId: lesson.id,
        completed: true,
        score: progress.score,
        xpEarned: 0,
        completedAt: progress.completedAt,
      };
    }

    if (!progress) {
      progress = new UserLessonProgress();
      progress.id = randomUUID();
      progress.userId = input.userId;
      progress.lessonId = input.lessonId;
      progress.completed = false;
      progress.score = 0;
      progress.completedAt = null;
    }

    progress.completed = true;
    progress.score = input.score;
    progress.completedAt = new Date();

    const saved = await this.progressRepo.upsert(progress);

    const user = await this.authRepo.findById(input.userId);
    if (user) {
      user.totalXp += lesson.xpReward;
      await this.authRepo.update(user);
    }

    return {
      lessonId: lesson.id,
      completed: saved.completed,
      score: saved.score,
      xpEarned: lesson.xpReward,
      completedAt: saved.completedAt,
    };
  }
}
