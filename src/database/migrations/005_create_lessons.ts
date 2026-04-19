import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLessons1000000000005 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "lessons" (
        "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"        VARCHAR(255) NOT NULL,
        "description"  TEXT NOT NULL DEFAULT '',
        "level"        VARCHAR(10) NOT NULL,
        "category"     VARCHAR(50) NOT NULL,
        "content_json" JSONB NOT NULL DEFAULT '{}',
        "order_index"  INT NOT NULL DEFAULT 0,
        "xp_reward"    INT NOT NULL DEFAULT 10,
        "is_published" BOOLEAN NOT NULL DEFAULT false,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_lessons_level_category" ON "lessons"("level", "category", "order_index")`);
    await queryRunner.query(`CREATE INDEX "idx_lessons_published"       ON "lessons"("is_published")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lessons"`);
  }
}
