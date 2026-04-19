import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vocabulary, VocabLevel } from '../domain/vocabulary.entity';
import { IVocabularyRepository, VocabularySearchResult } from '../domain/vocabulary.repository.interface';
import { VocabularyTypeormEntity } from './entities/vocabulary.typeorm.entity';
import { VocabularyMapper } from './mappers/vocabulary.mapper';

@Injectable()
export class VocabularyRepository implements IVocabularyRepository {
  constructor(
    @InjectRepository(VocabularyTypeormEntity)
    private readonly repo: Repository<VocabularyTypeormEntity>,
  ) {}

  async findById(id: string): Promise<Vocabulary | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? VocabularyMapper.toDomain(orm) : null;
  }

  async findByIds(ids: string[]): Promise<Vocabulary[]> {
    if (ids.length === 0) return [];
    const orms = await this.repo
      .createQueryBuilder('v')
      .where('v.id IN (:...ids)', { ids })
      .getMany();
    return orms.map(VocabularyMapper.toDomain);
  }

  async findByLevelExcluding(level: VocabLevel, excludeIds: string[], limit: number): Promise<Vocabulary[]> {
    const qb = this.repo.createQueryBuilder('v').where('v.level = :level', { level });

    if (excludeIds.length > 0) {
      qb.andWhere('v.id NOT IN (:...excludeIds)', { excludeIds });
    }

    const orms = await qb.orderBy('RANDOM()').limit(limit).getMany();
    return orms.map(VocabularyMapper.toDomain);
  }

  async search(q: string, level?: VocabLevel, page = 1, limit = 20): Promise<VocabularySearchResult> {
    const qb = this.repo
      .createQueryBuilder('v')
      .where('(v.word ILIKE :q OR v.definitionVi ILIKE :q OR v.definitionEn ILIKE :q)', { q: `%${q}%` });

    if (level) {
      qb.andWhere('v.level = :level', { level });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items: items.map(VocabularyMapper.toDomain), total };
  }
}
