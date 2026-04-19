import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/auth.repository.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase implements IUseCase<RefreshTokenDto, RefreshOutput> {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<RefreshOutput> {
    const refreshSecret = this.config.getOrThrow<string>('jwt.refreshSecret');

    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken, { secret: refreshSecret }) as typeof payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const oldHash = createHash('sha256').update(dto.refreshToken).digest('hex');
    const record = await this.authRepo.findRefreshToken(oldHash);
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    // Rotate: xóa token cũ, tạo cặp mới
    await this.authRepo.deleteRefreshToken(oldHash);

    const newPayload = { sub: payload.sub, email: payload.email, role: payload.role };
    const accessToken = this.jwtService.sign(newPayload);
    const refreshToken = this.jwtService.sign(newPayload, {
      secret: refreshSecret,
      expiresIn: 30 * 24 * 60 * 60,
    });

    const newHash = createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.authRepo.saveRefreshToken({ userId: payload.sub, tokenHash: newHash, expiresAt });

    return { accessToken, refreshToken };
  }
}
