import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserVocabularyProgress1000000000004 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_vocabulary_progress" (
        "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"          UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "vocabulary_id"    UUID NOT NULL REFERENCES "vocabularies"("id") ON DELETE CASCADE,
        "status"           VARCHAR(20) NOT NULL DEFAULT 'new',
        "ease_factor"      DECIMAL(4,2) NOT NULL DEFAULT 2.5,
        "interval_days"    INT NOT NULL DEFAULT 1,
        "repetitions"      INT NOT NULL DEFAULT 0,
        "next_review_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "last_reviewed_at" TIMESTAMPTZ,
        UNIQUE ("user_id", "vocabulary_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_uvp_user_next_review" ON "user_vocabulary_progress"("user_id", "next_review_at")`);
    await queryRunner.query(`CREATE INDEX "idx_uvp_user_status"     ON "user_vocabulary_progress"("user_id", "status")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_vocabulary_progress"`);
  }
}
