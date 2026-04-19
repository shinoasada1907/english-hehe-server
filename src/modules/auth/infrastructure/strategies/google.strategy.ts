import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/auth.repository.interface';
import { User } from '../../domain/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    @Inject(AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
  ) {
    super({
      clientID: config.get<string>('google.clientId') ?? '',
      clientSecret: config.get<string>('google.clientSecret') ?? '',
      callbackURL: config.get<string>('google.callbackUrl') ?? '',
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('No email returned from Google');

    let user = await this.authRepo.findByEmail(email);
    if (!user) {
      const newUser = User.create({
        id: randomUUID(),
        email,
        passwordHash: null,
        fullName: profile.displayName ?? email,
        googleId: profile.id,
      });
      return this.authRepo.create(newUser);
    }

    if (!user.googleId) {
      user.googleId = profile.id;
      return this.authRepo.update(user);
    }

    return user;
  }
}
