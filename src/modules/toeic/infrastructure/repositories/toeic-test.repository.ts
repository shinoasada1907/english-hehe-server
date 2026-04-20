import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IToeicTestRepository } from '../../domain/toeic.repository.interface';
import { ToeicGroup, ToeicQuestion, ToeicTest } from '../../domain/toeic.entity';
import { ToeicTestTypeormEntity } from '../entities/toeic-test.typeorm.entity';
import { ToeicGroupTypeormEntity } from '../entities/toeic-group.typeorm.entity';

@Injectable()
export class ToeicTestRepository implements IToeicTestRepository {
  constructor(
    @InjectRepository(ToeicTestTypeormEntity)
    private readonly testRepo: Repository<ToeicTestTypeormEntity>,
    @InjectRepository(ToeicGroupTypeormEntity)
    private readonly groupRepo: Repository<ToeicGroupTypeormEntity>,
  ) {}

  async findAll(published?: boolean): Promise<ToeicTest[]> {
    const qb = this.testRepo.createQueryBuilder('t').orderBy('t.createdAt', 'DESC');
    if (published !== undefined) qb.where('t.isPublished = :published', { published });
    return qb.getMany();
  }

  async findById(id: string): Promise<ToeicTest | null> {
    return this.testRepo.findOne({ where: { id } });
  }

  async findGroupsWithQuestions(testId: string): Promise<(ToeicGroup & { questions: ToeicQuestion[] })[]> {
    const groups = await this.groupRepo.find({
      where: { testId },
      relations: ['questions'],
      order: { orderIndex: 'ASC' },
    });

    return groups.map((g) => ({
      id: g.id,
      testId: g.testId,
      partNumber: g.partNumber as ToeicGroup['partNumber'],
      passageText: g.passageText,
      audioUrl: g.audioUrl,
      imageUrl: g.imageUrl,
      orderIndex: g.orderIndex,
      questions: g.questions
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((q) => ({
          id: q.id,
          groupId: q.groupId,
          content: q.content,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          orderIndex: q.orderIndex,
        })),
    }));
  }
}
