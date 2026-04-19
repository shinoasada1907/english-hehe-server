import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import {
  IAuthRepository,
  SaveRefreshTokenParams,
  RefreshTokenRecord,
} from '../domain/auth.repository.interface';
import { UserTypeormEntity } from './entities/user.typeorm.entity';
import { RefreshTokenTypeormEntity } from './entities/refresh-token.typeorm.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepo: Repository<UserTypeormEntity>,
    @InjectRepository(RefreshTokenTypeormEntity)
    private readonly tokenRepo: Repository<RefreshTokenTypeormEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.userRepo.findOne({ where: { email } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.userRepo.findOne({ where: { id } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async create(user: User): Promise<User> {
    const orm = this.userRepo.create(UserMapper.toPersistence(user));
    const saved = await this.userRepo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    await this.userRepo.update(user.id, UserMapper.toPersistence(user));
    const updated = await this.userRepo.findOneOrFail({ where: { id: user.id } });
    return UserMapper.toDomain(updated);
  }

  async saveRefreshToken(params: SaveRefreshTokenParams): Promise<void> {
    const token = this.tokenRepo.create({
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
    });
    await this.tokenRepo.save(token);
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const token = await this.tokenRepo.findOne({ where: { tokenHash } });
    if (!token) return null;
    return { userId: token.userId, expiresAt: token.expiresAt };
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.tokenRepo.delete({ tokenHash });
  }

  async deleteAllRefreshTokens(userId: string): Promise<void> {
    await this.tokenRepo.delete({ userId });
  }
}
