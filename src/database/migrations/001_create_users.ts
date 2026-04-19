import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1000000000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255) UNIQUE NOT NULL,
        "password_hash" VARCHAR(255),
        "full_name"     VARCHAR(255) NOT NULL,
        "role"          VARCHAR(20) NOT NULL DEFAULT 'user',
        "current_level" VARCHAR(30) NOT NULL DEFAULT 'beginner',
        "streak_days"   INT NOT NULL DEFAULT 0,
        "total_xp"      INT NOT NULL DEFAULT 0,
        "daily_goal"    INT NOT NULL DEFAULT 20,
        "google_id"     VARCHAR(255) UNIQUE,
        "is_active"     BOOLEAN NOT NULL DEFAULT true,
        "last_active_at" TIMESTAMPTZ,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_users_role" ON "users"("role")`);
    await queryRunner.query(`CREATE INDEX "idx_users_google_id" ON "users"("google_id") WHERE "google_id" IS NOT NULL`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
