import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { UserVocabularyProgress } from '../domain/user-vocabulary-progress.entity';
import { IUserVocabProgressRepository } from '../domain/user-vocab-progress.repository.interface';
import { UserVocabularyProgressTypeormEntity } from './entities/user-vocabulary-progress.typeorm.entity';
import { UserVocabProgressMapper } from './mappers/user-vocab-progress.mapper';

@Injectable()
export class UserVocabProgressRepository implements IUserVocabProgressRepository {
  constructor(
    @InjectRepository(UserVocabularyProgressTypeormEntity)
    private readonly repo: Repository<UserVocabularyProgressTypeormEntity>,
  ) {}

  async findByUserAndVocab(userId: string, vocabularyId: string): Promise<UserVocabularyProgress | null> {
    const orm = await this.repo.findOne({ where: { userId, vocabularyId } });
    return orm ? UserVocabProgressMapper.toDomain(orm) : null;
  }

  async findDueForReview(userId: string): Promise<UserVocabularyProgress[]> {
    const orms = await this.repo.find({
      where: {
        userId,
        nextReviewAt: LessThanOrEqual(new Date()),
      },
    });
    return orms.map(UserVocabProgressMapper.toDomain);
  }

  async findLearnedVocabIds(userId: string): Promise<string[]> {
    const records = await this.repo.find({
      where: { userId },
      select: ['vocabularyId'],
    });
    return records.map((r) => r.vocabularyId);
  }

  async upsert(progress: UserVocabularyProgress): Promise<UserVocabularyProgress> {
    const orm = this.repo.create(UserVocabProgressMapper.toPersistence(progress) as UserVocabularyProgressTypeormEntity);
    const saved = await this.repo.save(orm);
    return UserVocabProgressMapper.toDomain(saved);
  }
}
