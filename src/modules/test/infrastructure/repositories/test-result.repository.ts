import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from '../../domain/test-result.entity';
import { ITestResultRepository } from '../../domain/test.repository.interface';
import { TestResultTypeormEntity } from '../entities/test-result.typeorm.entity';
import { TestResultMapper } from '../mappers/test-result.mapper';

@Injectable()
export class TestResultRepository implements ITestResultRepository {
  constructor(
    @InjectRepository(TestResultTypeormEntity)
    private readonly repo: Repository<TestResultTypeormEntity>,
  ) {}

  async save(result: TestResult): Promise<TestResult> {
    const orm = this.repo.create(TestResultMapper.toPersistence(result) as TestResultTypeormEntity);
    const saved = await this.repo.save(orm);
    return TestResultMapper.toDomain(saved);
  }

  async findByUser(userId: string): Promise<TestResult[]> {
    const orms = await this.repo.find({
      where: { userId },
      order: { completedAt: 'DESC' },
    });
    return orms.map(TestResultMapper.toDomain);
  }
}
