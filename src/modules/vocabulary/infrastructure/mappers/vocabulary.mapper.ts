import { Vocabulary, VocabLevel, WordType } from '../../domain/vocabulary.entity';
import { VocabularyTypeormEntity } from '../entities/vocabulary.typeorm.entity';

export class VocabularyMapper {
  static toDomain(orm: VocabularyTypeormEntity): Vocabulary {
    const v = new Vocabulary();
    v.id = orm.id;
    v.word = orm.word;
    v.ipa = orm.ipa;
    v.definitionVi = orm.definitionVi;
    v.definitionEn = orm.definitionEn;
    v.exampleSentence = orm.exampleSentence;
    v.audioUrl = orm.audioUrl;
    v.imageUrl = orm.imageUrl;
    v.level = orm.level as VocabLevel;
    v.topicTags = orm.topicTags ?? [];
    v.wordType = orm.wordType as WordType;
    v.createdAt = orm.createdAt;
    v.updatedAt = orm.updatedAt;
    return v;
  }

  static toPersistence(v: Vocabulary): Partial<VocabularyTypeormEntity> {
    return {
      id: v.id,
      word: v.word,
      ipa: v.ipa,
      definitionVi: v.definitionVi,
      definitionEn: v.definitionEn,
      exampleSentence: v.exampleSentence,
      audioUrl: v.audioUrl,
      imageUrl: v.imageUrl,
      level: v.level,
      topicTags: v.topicTags,
      wordType: v.wordType,
    };
  }
}
