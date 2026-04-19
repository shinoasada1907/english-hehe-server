import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { IAuthRepository } from '../../domain/auth.repository.interface';

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

const mockJwtService = {
  sign: jest.fn().mockReturnValue('new-access-token'),
  verify: jest.fn(),
};
const mockConfig = { get: jest.fn().mockReturnValue('secret'), getOrThrow: jest.fn().mockReturnValue('secret') };

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(mockRepo, mockJwtService as never, mockConfig as never);
  });

  it('should issue new access token for valid refresh token', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 'uuid-1', email: 'test@example.com' });
    mockRepo.findRefreshToken.mockResolvedValue({
      userId: 'uuid-1',
      expiresAt: new Date(Date.now() + 86400000),
    });

    const result = await useCase.execute({ refreshToken: 'valid.refresh.token' });
    expect(result.accessToken).toBe('new-access-token');
  });

  it('should throw if refresh token invalid (jwt verify fails)', async () => {
    mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

    await expect(
      useCase.execute({ refreshToken: 'bad.token' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if refresh token not found in DB', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 'uuid-1', email: 'test@example.com' });
    mockRepo.findRefreshToken.mockResolvedValue(null);

    await expect(
      useCase.execute({ refreshToken: 'valid.but.not.in.db' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if refresh token expired in DB', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 'uuid-1', email: 'test@example.com' });
    mockRepo.findRefreshToken.mockResolvedValue({
      userId: 'uuid-1',
      expiresAt: new Date(Date.now() - 1000), // đã hết hạn
    });

    await expect(
      useCase.execute({ refreshToken: 'expired.token' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
