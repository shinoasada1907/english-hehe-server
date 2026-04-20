import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from '../../domain/test.entity';
import { ITestRepository, TestFilter } from '../../domain/test.repository.interface';
import { TestTypeormEntity } from '../entities/test.typeorm.entity';
import { TestMapper } from '../mappers/test.mapper';

@Injectable()
export class TestRepository implements ITestRepository {
  constructor(
    @InjectRepository(TestTypeormEntity)
    private readonly repo: Repository<TestTypeormEntity>,
  ) {}

  async findAll(filter: TestFilter): Promise<Test[]> {
    const qb = this.repo.createQueryBuilder('t').where('t.isPublished = true');
    if (filter.level) qb.andWhere('t.level = :level', { level: filter.level });
    if (filter.category) qb.andWhere('t.category = :category', { category: filter.category });
    const orms = await qb.orderBy('t.level', 'ASC').getMany();
    return orms.map(TestMapper.toDomain);
  }

  async findById(id: string): Promise<Test | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? TestMapper.toDomain(orm) : null;
  }
}
