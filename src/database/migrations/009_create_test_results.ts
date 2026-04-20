import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTestResults1000000000009 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "test_results" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"       UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "test_id"       UUID NOT NULL REFERENCES "tests"("id") ON DELETE CASCADE,
        "score"         INT NOT NULL DEFAULT 0,
        "correct_count" INT NOT NULL DEFAULT 0,
        "total_count"   INT NOT NULL DEFAULT 0,
        "xp_earned"     INT NOT NULL DEFAULT 0,
        "answers"       JSONB NOT NULL DEFAULT '{}',
        "completed_at"  TIMESTAMPTZ NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_test_results_user" ON "test_results"("user_id", "completed_at" DESC)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "test_results"`);
  }
}
