import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID, createHash } from 'crypto';
import { IUseCase } from '@shared/application/base.use-case';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/auth.repository.interface';
import { User } from '../../domain/user.entity';
import { RegisterDto } from '../dto/register.dto';

export interface RegisterOutput {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; fullName: string; role: string };
}

@Injectable()
export class RegisterUseCase implements IUseCase<RegisterDto, RegisterOutput> {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterOutput> {
    const existing = await this.authRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = User.create({
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
    });
    const saved = await this.authRepo.create(user);
    const { accessToken, refreshToken } = await this.signAndSaveTokens(saved.id, saved.email.toString(), saved.role);

    return {
      accessToken,
      refreshToken,
      user: { id: saved.id, email: saved.email.toString(), fullName: saved.fullName, role: saved.role },
    };
  }

  private async signAndSaveTokens(userId: string, email: string, role: string) {
    const refreshSecret = this.config.getOrThrow<string>('jwt.refreshSecret');
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: 30 * 24 * 60 * 60,
    });

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.authRepo.saveRefreshToken({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken };
  }
}
