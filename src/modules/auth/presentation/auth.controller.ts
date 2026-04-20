import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Optional,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { GoogleLoginUseCase } from '../application/use-cases/google-login.use-case';
import { RegisterDto } from '../application/dto/register.dto';
import { LoginDto } from '../application/dto/login.dto';
import { RefreshTokenDto } from '../application/dto/refresh-token.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { User } from '../domain/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    @Optional() private readonly googleLoginUseCase?: GoogleLoginUseCase,
  ) {}

  @ApiOperation({ summary: 'Đăng ký tài khoản email/password' })
  @ApiResponse({ status: 201, description: 'Trả về access + refresh token' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Đăng nhập email/password' })
  @ApiResponse({ status: 200, description: 'Trả về access + refresh token' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Làm mới access token bằng refresh token' })
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Lấy profile người dùng hiện tại' })
  @ApiBearerAuth('access-token')
  @Get('me')
  @UseGuards(JwtGuard)
  getProfile(@CurrentUser() user: { id: string }) {
    return this.getProfileUseCase.execute(user.id);
  }

  @ApiOperation({ summary: 'Bắt đầu đăng nhập Google OAuth' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    if (!this.googleLoginUseCase) {
      throw new HttpException(
        'Google OAuth is not configured',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  @ApiOperation({ summary: 'Google OAuth callback — trả về JWT tokens' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@CurrentUser() user: User) {
    if (!this.googleLoginUseCase) {
      throw new HttpException(
        'Google OAuth is not configured',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return this.googleLoginUseCase.execute(user);
  }
}
