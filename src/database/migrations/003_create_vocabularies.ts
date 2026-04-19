import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVocabularies1000000000003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "vocabularies" (
        "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "word"             VARCHAR(255) NOT NULL,
        "ipa"              VARCHAR(255) NOT NULL DEFAULT '',
        "definition_vi"    TEXT NOT NULL,
        "definition_en"    TEXT NOT NULL DEFAULT '',
        "example_sentence" TEXT NOT NULL DEFAULT '',
        "audio_url"        VARCHAR(500) NOT NULL DEFAULT '',
        "image_url"        VARCHAR(500),
        "level"            VARCHAR(10) NOT NULL,
        "topic_tags"       TEXT[] NOT NULL DEFAULT '{}',
        "word_type"        VARCHAR(50) NOT NULL DEFAULT 'noun',
        "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_vocabularies_level" ON "vocabularies"("level")`);
    await queryRunner.query(`CREATE INDEX "idx_vocabularies_word"  ON "vocabularies"("word")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vocabularies"`);
  }
}
