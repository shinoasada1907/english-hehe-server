import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { IVocabularyRepository, VOCABULARY_REPOSITORY } from '../../domain/vocabulary.repository.interface';
import { Vocabulary } from '../../domain/vocabulary.entity';

@Injectable()
export class GetVocabularyDetailUseCase implements IUseCase<string, Vocabulary> {
  constructor(
    @Inject(VOCABULARY_REPOSITORY) private readonly vocabRepo: IVocabularyRepository,
  ) {}

  async execute(id: string): Promise<Vocabulary> {
    const vocab = await this.vocabRepo.findById(id);
    if (!vocab) throw new NotFoundException('Vocabulary not found');
    return vocab;
  }
}
