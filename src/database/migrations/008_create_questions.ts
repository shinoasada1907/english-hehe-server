import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestions1000000000008 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "questions" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "test_id"        UUID NOT NULL REFERENCES "tests"("id") ON DELETE CASCADE,
        "content"        TEXT NOT NULL,
        "choices"        TEXT[] NOT NULL,
        "correct_answer" INT NOT NULL,
        "explanation"    TEXT,
        "order_index"    INT NOT NULL DEFAULT 0
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_questions_test" ON "questions"("test_id", "order_index")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "questions"`);
  }
}
