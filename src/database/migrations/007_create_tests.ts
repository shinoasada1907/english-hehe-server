import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTests1000000000007 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tests" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"        VARCHAR(255) NOT NULL,
        "description"  TEXT NOT NULL DEFAULT '',
        "level"        VARCHAR(10) NOT NULL,
        "category"     VARCHAR(50) NOT NULL,
        "time_limit"   INT NOT NULL DEFAULT 30,
        "max_xp"       INT NOT NULL DEFAULT 50,
        "is_published" BOOLEAN NOT NULL DEFAULT false,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_tests_level_category" ON "tests"("level", "category")`);
    await queryRunner.query(`CREATE INDEX "idx_tests_published"       ON "tests"("is_published")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tests"`);
  }
}
