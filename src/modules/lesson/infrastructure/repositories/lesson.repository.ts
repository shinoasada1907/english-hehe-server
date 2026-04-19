import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../domain/lesson.entity';
import { ILessonRepository, LessonFilter } from '../../domain/lesson.repository.interface';
import { LessonTypeormEntity } from '../entities/lesson.typeorm.entity';
import { LessonMapper } from '../mappers/lesson.mapper';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(
    @InjectRepository(LessonTypeormEntity)
    private readonly repo: Repository<LessonTypeormEntity>,
  ) {}

  async findAll(filter: LessonFilter): Promise<Lesson[]> {
    const qb = this.repo
      .createQueryBuilder('l')
      .where('l.isPublished = true');

    if (filter.level) qb.andWhere('l.level = :level', { level: filter.level });
    if (filter.category) qb.andWhere('l.category = :category', { category: filter.category });

    const orms = await qb.orderBy('l.level', 'ASC').addOrderBy('l.orderIndex', 'ASC').getMany();
    return orms.map(LessonMapper.toDomain);
  }

  async findById(id: string): Promise<Lesson | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? LessonMapper.toDomain(orm) : null;
  }

  async findByIds(ids: string[]): Promise<Lesson[]> {
    if (ids.length === 0) return [];
    const orms = await this.repo
      .createQueryBuilder('l')
      .where('l.id IN (:...ids)', { ids })
      .getMany();
    return orms.map(LessonMapper.toDomain);
  }
}
