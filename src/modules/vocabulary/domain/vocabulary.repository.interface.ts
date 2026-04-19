import { Vocabulary, VocabLevel } from './vocabulary.entity';

export const VOCABULARY_REPOSITORY = Symbol('IVocabularyRepository');

export interface VocabularySearchResult {
  items: Vocabulary[];
  total: number;
}

export interface IVocabularyRepository {
  findById(id: string): Promise<Vocabulary | null>;
  findByIds(ids: string[]): Promise<Vocabulary[]>;
  findByLevelExcluding(level: VocabLevel, excludeIds: string[], limit: number): Promise<Vocabulary[]>;
  search(q: string, level?: VocabLevel, page?: number, limit?: number): Promise<VocabularySearchResult>;
}
