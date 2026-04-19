import { GetDailyWordsUseCase } from './get-daily-words.use-case';
import { IVocabularyRepository } from '../../domain/vocabulary.repository.interface';
import { IUserVocabProgressRepository } from '../../domain/user-vocab-progress.repository.interface';
import { IAuthRepository } from '@modules/auth/domain/auth.repository.interface';
import { User } from '@modules/auth/domain/user.entity';

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

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

const fakeWord = {
  id: 'vocab-1',
  word: 'book',
  ipa: '/bʊk/',
  definitionVi: 'sách',
  definitionEn: 'A written work',
  exampleSentence: 'I read a book.',
  audioUrl: '',
  imageUrl: null,
  level: 'A1' as const,
  topicTags: [],
  wordType: 'noun' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GetDailyWordsUseCase', () => {
  let useCase: GetDailyWordsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetDailyWordsUseCase(
      mockVocabRepo,
      mockProgressRepo,
      mockAuthRepo,
      mockRedis as never,
    );
  });

  it('should return cached words if Redis hit', async () => {
    mockRedis.get.mockResolvedValue([fakeWord]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual([fakeWord]);
    expect(mockVocabRepo.findByLevelExcluding).not.toHaveBeenCalled();
  });

  it('should fetch and cache words on Redis miss', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue(undefined);

    const user = User.create({ id: 'user-1', email: 'test@example.com', passwordHash: 'hash', fullName: 'Test' });
    mockAuthRepo.findById.mockResolvedValue(user);
    mockProgressRepo.findLearnedVocabIds.mockResolvedValue([]);
    mockVocabRepo.findByLevelExcluding.mockResolvedValue([fakeWord]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual([fakeWord]);
    expect(mockVocabRepo.findByLevelExcluding).toHaveBeenCalledWith('A1', [], 10);
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
  });

  it('should exclude already-learned vocab ids', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue(undefined);

    const user = User.create({ id: 'user-1', email: 'test@example.com', passwordHash: 'hash', fullName: 'Test' });
    mockAuthRepo.findById.mockResolvedValue(user);
    mockProgressRepo.findLearnedVocabIds.mockResolvedValue(['vocab-old-1', 'vocab-old-2']);
    mockVocabRepo.findByLevelExcluding.mockResolvedValue([fakeWord]);

    await useCase.execute({ userId: 'user-1' });

    expect(mockVocabRepo.findByLevelExcluding).toHaveBeenCalledWith('A1', ['vocab-old-1', 'vocab-old-2'], 10);
  });
});
