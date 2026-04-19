import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { IVocabularyRepository, VOCABULARY_REPOSITORY, VocabularySearchResult } from '../../domain/vocabulary.repository.interface';
import { SearchVocabularyDto } from '../dto/search-vocabulary.dto';

@Injectable()
export class SearchVocabularyUseCase implements IUseCase<SearchVocabularyDto, VocabularySearchResult> {
  constructor(
    @Inject(VOCABULARY_REPOSITORY) private readonly vocabRepo: IVocabularyRepository,
  ) {}

  async execute(dto: SearchVocabularyDto): Promise<VocabularySearchResult> {
    return this.vocabRepo.search(dto.q, dto.level, dto.page ?? 1, dto.limit ?? 20);
  }
}
