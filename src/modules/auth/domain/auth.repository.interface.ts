import { User } from './user.entity';

export interface SaveRefreshTokenParams {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface RefreshTokenRecord {
  userId: string;
  expiresAt: Date;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  saveRefreshToken(params: SaveRefreshTokenParams): Promise<void>;
  findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null>;
  deleteRefreshToken(tokenHash: string): Promise<void>;
  deleteAllRefreshTokens(userId: string): Promise<void>;
}

export const AUTH_REPOSITORY = Symbol('IAuthRepository');
