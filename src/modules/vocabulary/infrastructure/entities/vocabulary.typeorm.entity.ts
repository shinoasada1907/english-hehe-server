import { Column, Entity, Index } from 'typeorm';
import { BaseTypeormEntity } from '@database/base.typeorm.entity';

@Entity('vocabularies')
export class VocabularyTypeormEntity extends BaseTypeormEntity {
  @Index()
  @Column()
  word!: string;

  @Column({ default: '' })
  ipa!: string;

  @Column({ name: 'definition_vi', type: 'text' })
  definitionVi!: string;

  @Column({ name: 'definition_en', type: 'text', default: '' })
  definitionEn!: string;

  @Column({ name: 'example_sentence', type: 'text', default: '' })
  exampleSentence!: string;

  @Column({ name: 'audio_url', default: '' })
  audioUrl!: string;

  @Column({ name: 'image_url', nullable: true, type: 'varchar' })
  imageUrl!: string | null;

  @Index()
  @Column({ length: 10 })
  level!: string;

  @Column({ name: 'topic_tags', type: 'text', array: true, default: [] })
  topicTags!: string[];

  @Column({ name: 'word_type', length: 50, default: 'noun' })
  wordType!: string;
}
