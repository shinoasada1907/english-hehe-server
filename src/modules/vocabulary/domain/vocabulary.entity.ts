export type VocabLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection' | 'pronoun';

export class Vocabulary {
  id!: string;
  word!: string;
  ipa!: string;
  definitionVi!: string;
  definitionEn!: string;
  exampleSentence!: string;
  audioUrl!: string;
  imageUrl!: string | null;
  level!: VocabLevel;
  topicTags!: string[];
  wordType!: WordType;
  createdAt!: Date;
  updatedAt!: Date;
}
