import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IToeicResultRepository } from '../../domain/toeic.repository.interface';
import { ToeicResult } from '../../domain/toeic.entity';
import { ToeicResultTypeormEntity } from '../entities/toeic-result.typeorm.entity';

@Injectable()
export class ToeicResultRepository implements IToeicResultRepository {
  constructor(
    @InjectRepository(ToeicResultTypeormEntity)
    private readonly repo: Repository<ToeicResultTypeormEntity>,
  ) {}

  async save(result: ToeicResult): Promise<ToeicResult> {
    const entity = this.repo.create({
      id: result.id,
      userId: result.userId,
      testId: result.testId,
      listeningScore: result.listeningScore,
      readingScore: result.readingScore,
      totalScore: result.totalScore,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      answers: result.answers,
      completedAt: result.completedAt,
    });
    return this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<ToeicResult[]> {
    const rows = await this.repo.find({
      where: { userId },
      order: { completedAt: 'DESC' },
      relations: ['test'],
    });
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      testId: r.testId,
      listeningScore: r.listeningScore,
      readingScore: r.readingScore,
      totalScore: r.totalScore,
      correctCount: r.correctCount,
      totalCount: r.totalCount,
      answers: r.answers,
      completedAt: r.completedAt,
    }));
  }
}
