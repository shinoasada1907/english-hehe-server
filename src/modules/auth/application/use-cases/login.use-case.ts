import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/auth.repository.interface';
import { LoginDto } from '../dto/login.dto';

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; fullName: string; role: string };
}

@Injectable()
export class LoginUseCase implements IUseCase<LoginDto, LoginOutput> {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginOutput> {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash) throw new UnauthorizedException('Please login with Google');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const refreshSecret = this.config.getOrThrow<string>('jwt.refreshSecret');
    const payload = { sub: user.id, email: user.email.toString(), role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: 30 * 24 * 60 * 60,
    });

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.authRepo.saveRefreshToken({ userId: user.id, tokenHash, expiresAt });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email.toString(), fullName: user.fullName, role: user.role },
    };
  }
}
