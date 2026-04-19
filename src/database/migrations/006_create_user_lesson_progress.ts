import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserLessonProgress1000000000006 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_lesson_progress" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"      UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "lesson_id"    UUID NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
        "completed"    BOOLEAN NOT NULL DEFAULT false,
        "score"        INT NOT NULL DEFAULT 0,
        "completed_at" TIMESTAMPTZ,
        UNIQUE ("user_id", "lesson_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_ulp_user_id" ON "user_lesson_progress"("user_id")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_lesson_progress"`);
  }
}
