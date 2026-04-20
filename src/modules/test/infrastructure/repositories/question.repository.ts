import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../domain/question.entity';
import { IQuestionRepository } from '../../domain/test.repository.interface';
import { QuestionTypeormEntity } from '../entities/question.typeorm.entity';
import { QuestionMapper } from '../mappers/question.mapper';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionTypeormEntity)
    private readonly repo: Repository<QuestionTypeormEntity>,
  ) {}

  async findByTestId(testId: string): Promise<Question[]> {
    const orms = await this.repo.find({
      where: { testId },
      order: { orderIndex: 'ASC' },
    });
    return orms.map(QuestionMapper.toDomain);
  }
}
