import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgress } from '../../domain/user-lesson-progress.entity';
import { IUserLessonProgressRepository } from '../../domain/user-lesson-progress.repository.interface';
import { UserLessonProgressTypeormEntity } from '../entities/user-lesson-progress.typeorm.entity';
import { UserLessonProgressMapper } from '../mappers/user-lesson-progress.mapper';

@Injectable()
export class UserLessonProgressRepository implements IUserLessonProgressRepository {
  constructor(
    @InjectRepository(UserLessonProgressTypeormEntity)
    private readonly repo: Repository<UserLessonProgressTypeormEntity>,
  ) {}

  async findByUser(userId: string): Promise<UserLessonProgress[]> {
    const orms = await this.repo.find({ where: { userId } });
    return orms.map(UserLessonProgressMapper.toDomain);
  }

  async findByUserAndLesson(userId: string, lessonId: string): Promise<UserLessonProgress | null> {
    const orm = await this.repo.findOne({ where: { userId, lessonId } });
    return orm ? UserLessonProgressMapper.toDomain(orm) : null;
  }

  async upsert(progress: UserLessonProgress): Promise<UserLessonProgress> {
    const orm = this.repo.create(
      UserLessonProgressMapper.toPersistence(progress) as UserLessonProgressTypeormEntity,
    );
    const saved = await this.repo.save(orm);
    return UserLessonProgressMapper.toDomain(saved);
  }
}
