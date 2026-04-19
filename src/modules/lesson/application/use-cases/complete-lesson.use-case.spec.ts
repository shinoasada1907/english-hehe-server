import { NotFoundException } from '@nestjs/common';
import { CompleteLessonUseCase } from './complete-lesson.use-case';
import { ILessonRepository } from '../../domain/lesson.repository.interface';
import { IUserLessonProgressRepository } from '../../domain/user-lesson-progress.repository.interface';
import { IAuthRepository } from '@modules/auth/domain/auth.repository.interface';
import { Lesson } from '../../domain/lesson.entity';
import { UserLessonProgress } from '../../domain/user-lesson-progress.entity';
import { User } from '@modules/auth/domain/user.entity';

const mockLessonRepo: jest.Mocked<ILessonRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
};

const mockProgressRepo: jest.Mocked<IUserLessonProgressRepository> = {
  findByUser: jest.fn(),
  findByUserAndLesson: jest.fn(),
  upsert: jest.fn(),
};

const mockAuthRepo: jest.Mocked<IAuthRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  saveRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  deleteAllRefreshTokens: jest.fn(),
};

const fakeLesson = (): Lesson => {
  const l = new Lesson();
  l.id = 'lesson-1';
  l.title = 'Test Lesson';
  l.description = '';
  l.level = 'A1';
  l.category = 'grammar';
  l.contentJson = {};
  l.orderIndex = 1;
  l.xpReward = 10;
  l.isPublished = true;
  l.createdAt = new Date();
  l.updatedAt = new Date();
  return l;
};

describe('CompleteLessonUseCase', () => {
  let useCase: CompleteLessonUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CompleteLessonUseCase(mockLessonRepo, mockProgressRepo, mockAuthRepo);
  });

  it('should throw NotFoundException if lesson not found', async () => {
    mockLessonRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId: 'user-1', lessonId: 'bad-id', score: 80 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return early (idempotent) if already completed', async () => {
    mockLessonRepo.findById.mockResolvedValue(fakeLesson());

    const existing = new UserLessonProgress();
    existing.id = 'prog-1';
    existing.userId = 'user-1';
    existing.lessonId = 'lesson-1';
    existing.completed = true;
    existing.score = 90;
    existing.completedAt = new Date();
    mockProgressRepo.findByUserAndLesson.mockResolvedValue(existing);

    const result = await useCase.execute({ userId: 'user-1', lessonId: 'lesson-1', score: 70 });

    expect(result.xpEarned).toBe(0);
    expect(result.score).toBe(90);
    expect(mockProgressRepo.upsert).not.toHaveBeenCalled();
    expect(mockAuthRepo.update).not.toHaveBeenCalled();
  });

  it('should complete lesson, award XP, and save progress', async () => {
    mockLessonRepo.findById.mockResolvedValue(fakeLesson());
    mockProgressRepo.findByUserAndLesson.mockResolvedValue(null);

    const saved = new UserLessonProgress();
    saved.id = 'prog-1';
    saved.userId = 'user-1';
    saved.lessonId = 'lesson-1';
    saved.completed = true;
    saved.score = 80;
    saved.completedAt = new Date();
    mockProgressRepo.upsert.mockResolvedValue(saved);

    const user = User.create({ id: 'user-1', email: 'test@example.com', passwordHash: 'hash', fullName: 'Test' });
    mockAuthRepo.findById.mockResolvedValue(user);
    mockAuthRepo.update.mockResolvedValue(user);

    const result = await useCase.execute({ userId: 'user-1', lessonId: 'lesson-1', score: 80 });

    expect(result.completed).toBe(true);
    expect(result.xpEarned).toBe(10);
    expect(mockProgressRepo.upsert).toHaveBeenCalledTimes(1);
    expect(mockAuthRepo.update).toHaveBeenCalledTimes(1);
  });
});
