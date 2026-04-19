import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from './register.use-case';
import { IAuthRepository } from '../../domain/auth.repository.interface';
import { User } from '../../domain/user.entity';

const mockRepo: jest.Mocked<IAuthRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  saveRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  deleteAllRefreshTokens: jest.fn(),
};

const mockJwtService = { sign: jest.fn().mockReturnValue('mock-token') };
const mockConfig = { get: jest.fn().mockReturnValue('secret'), getOrThrow: jest.fn().mockReturnValue('secret') };

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUseCase(
      mockRepo,
      mockJwtService as never,
      mockConfig as never,
    );
  });

  it('should register a new user and return tokens', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    const fakeUser = User.create({
      id: 'uuid-1',
      email: 'test@example.com',
      passwordHash: 'hashed',
      fullName: 'Test User',
    });
    mockRepo.create.mockResolvedValue(fakeUser);
    mockRepo.saveRefreshToken.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    expect(result.accessToken).toBe('mock-token');
    expect(result.refreshToken).toBe('mock-token');
    expect(result.user.email).toBe('test@example.com');
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(mockRepo.saveRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException if email already exists', async () => {
    const existing = User.create({
      id: 'uuid-1',
      email: 'test@example.com',
      passwordHash: 'hash',
      fullName: 'Existing',
    });
    mockRepo.findByEmail.mockResolvedValue(existing);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'pass1234', fullName: 'Test' }),
    ).rejects.toThrow(ConflictException);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
