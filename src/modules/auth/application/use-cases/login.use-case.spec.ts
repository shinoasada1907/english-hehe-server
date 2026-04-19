import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { IAuthRepository } from '../../domain/auth.repository.interface';
import { User } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';

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

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(mockRepo, mockJwtService as never, mockConfig as never);
  });

  it('should login and return tokens', async () => {
    const hash = await bcrypt.hash('password123', 10);
    const user = User.create({ id: 'uuid-1', email: 'test@example.com', passwordHash: hash, fullName: 'Test' });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockRepo.saveRefreshToken.mockResolvedValue(undefined);

    const result = await useCase.execute({ email: 'test@example.com', password: 'password123' });

    expect(result.accessToken).toBe('mock-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(
      useCase.execute({ email: 'no@example.com', password: 'pass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password wrong', async () => {
    const hash = await bcrypt.hash('correctpass', 10);
    const user = User.create({ id: 'uuid-1', email: 'test@example.com', passwordHash: hash, fullName: 'Test' });
    mockRepo.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
