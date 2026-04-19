import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserTypeormEntity } from './infrastructure/entities/user.typeorm.entity';
import { RefreshTokenTypeormEntity } from './infrastructure/entities/refresh-token.typeorm.entity';
import { AuthRepository } from './infrastructure/auth.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { GoogleStrategy } from './infrastructure/strategies/google.strategy';
import { GoogleLoginUseCase } from './application/use-cases/google-login.use-case';
import { AuthController } from './presentation/auth.controller';
import { AUTH_REPOSITORY } from './domain/auth.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeormEntity, RefreshTokenTypeormEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: 15 * 60 }, // 15 phút (seconds)
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_REPOSITORY, useClass: AuthRepository },
    JwtStrategy,
    GoogleStrategy,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    GetProfileUseCase,
    GoogleLoginUseCase,
  ],
  exports: [JwtStrategy, PassportModule, AUTH_REPOSITORY],
})
export class AuthModule {}
