import { NotFoundException } from '@nestjs/common';
import { MarkWordStatusUseCase } from './mark-word-status.use-case';
import { IVocabularyRepository } from '../../domain/vocabulary.repository.interface';
import { IUserVocabProgressRepository } from '../../domain/user-vocab-progress.repository.interface';
import { UserVocabularyProgress } from '../../domain/user-vocabulary-progress.entity';

const mockVocabRepo: jest.Mocked<IVocabularyRepository> = {
  findById: jest.fn(),
  findByIds: jest.fn(),
  findByLevelExcluding: jest.fn(),
  search: jest.fn(),
};

const mockProgressRepo: jest.Mocked<IUserVocabProgressRepository> = {
  findByUserAndVocab: jest.fn(),
  findDueForReview: jest.fn(),
  findLearnedVocabIds: jest.fn(),
  upsert: jest.fn(),
};

const mockRedis = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

const fakeVocab = {
  id: 'vocab-1', word: 'book', ipa: '/bʊk/', definitionVi: 'sách', definitionEn: 'A book',
  exampleSentence: 'I read.', audioUrl: '', imageUrl: null,
  level: 'A1' as const, topicTags: [], wordType: 'noun' as const, createdAt: new Date(), updatedAt: new Date(),
};

describe('MarkWordStatusUseCase', () => {
  let useCase: MarkWordStatusUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new MarkWordStatusUseCase(mockVocabRepo, mockProgressRepo, mockRedis as never);
  });

  it('should throw NotFoundException if vocab not found', async () => {
    mockVocabRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId: 'user-1', vocabularyId: 'bad-id', quality: 4 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create new progress when first time marking', async () => {
    mockVocabRepo.findById.mockResolvedValue(fakeVocab);
    mockProgressRepo.findByUserAndVocab.mockResolvedValue(null);
    mockRedis.del.mockResolvedValue(undefined);

    const saved = new UserVocabularyProgress();
    saved.id = 'prog-1';
    saved.userId = 'user-1';
    saved.vocabularyId = 'vocab-1';
    saved.status = 'review';
    saved.easeFactor = 2.5;
    saved.intervalDays = 1;
    saved.repetitions = 1;
    saved.nextReviewAt = new Date(Date.now() + 86400000);
    saved.lastReviewedAt = new Date();
    mockProgressRepo.upsert.mockResolvedValue(saved);

    const result = await useCase.execute({ userId: 'user-1', vocabularyId: 'vocab-1', quality: 4 });

    expect(mockProgressRepo.upsert).toHaveBeenCalledTimes(1);
    expect(result.vocabularyId).toBe('vocab-1');
    expect(mockRedis.del).toHaveBeenCalledTimes(1);
  });

  it('should apply SM-2 on existing progress and invalidate cache', async () => {
    mockVocabRepo.findById.mockResolvedValue(fakeVocab);

    const existing = new UserVocabularyProgress();
    existing.id = 'prog-1';
    existing.userId = 'user-1';
    existing.vocabularyId = 'vocab-1';
    existing.status = 'review';
    existing.easeFactor = 2.5;
    existing.intervalDays = 6;
    existing.repetitions = 2;
    existing.nextReviewAt = new Date();
    existing.lastReviewedAt = new Date();
    mockProgressRepo.findByUserAndVocab.mockResolvedValue(existing);

    const saved = { ...existing, intervalDays: 15, repetitions: 3, status: 'review' as const };
    mockProgressRepo.upsert.mockResolvedValue(saved as UserVocabularyProgress);
    mockRedis.del.mockResolvedValue(undefined);

    const result = await useCase.execute({ userId: 'user-1', vocabularyId: 'vocab-1', quality: 5 });

    expect(result.intervalDays).toBe(15);
    expect(mockRedis.del).toHaveBeenCalledTimes(1);
  });
});
