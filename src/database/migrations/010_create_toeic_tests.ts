import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateToeicTests1000000000010 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "toeic_tests" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"        VARCHAR NOT NULL,
        "description"  TEXT NOT NULL DEFAULT '',
        "year"         INT,
        "is_published" BOOLEAN NOT NULL DEFAULT false,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "toeic_groups" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "test_id"      UUID NOT NULL REFERENCES "toeic_tests"("id") ON DELETE CASCADE,
        "part_number"  SMALLINT NOT NULL CHECK (part_number BETWEEN 1 AND 7),
        "passage_text" TEXT,
        "audio_url"    VARCHAR,
        "image_url"    VARCHAR,
        "order_index"  INT NOT NULL DEFAULT 0
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_toeic_groups_test" ON "toeic_groups"("test_id", "part_number", "order_index")`);

    await queryRunner.query(`
      CREATE TABLE "toeic_questions" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "group_id"       UUID NOT NULL REFERENCES "toeic_groups"("id") ON DELETE CASCADE,
        "content"        TEXT NOT NULL,
        "choices"        TEXT[] NOT NULL,
        "correct_answer" SMALLINT NOT NULL,
        "explanation"    TEXT,
        "order_index"    INT NOT NULL DEFAULT 0
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_toeic_questions_group" ON "toeic_questions"("group_id", "order_index")`);

    await queryRunner.query(`
      CREATE TABLE "toeic_results" (
        "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"          UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "test_id"          UUID NOT NULL REFERENCES "toeic_tests"("id") ON DELETE CASCADE,
        "listening_score"  INT NOT NULL DEFAULT 0,
        "reading_score"    INT NOT NULL DEFAULT 0,
        "total_score"      INT NOT NULL DEFAULT 0,
        "correct_count"    INT NOT NULL DEFAULT 0,
        "total_count"      INT NOT NULL DEFAULT 0,
        "answers"          JSONB NOT NULL DEFAULT '{}',
        "completed_at"     TIMESTAMPTZ NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_toeic_results_user" ON "toeic_results"("user_id", "completed_at" DESC)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "toeic_results"`);
    await queryRunner.query(`DROP TABLE "toeic_questions"`);
    await queryRunner.query(`DROP TABLE "toeic_groups"`);
    await queryRunner.query(`DROP TABLE "toeic_tests"`);
  }
}
