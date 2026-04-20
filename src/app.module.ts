import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from '@database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from '@modules/auth/auth.module';
import { VocabularyModule } from '@modules/vocabulary/vocabulary.module';
import { LessonModule } from '@modules/lesson/lesson.module';
import { TestModule } from '@modules/test/test.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { AdminModule } from '@modules/admin/admin.module';
import { ToeicModule } from '@modules/toeic/toeic.module';
import { HealthController } from './health/health.controller';
import { envValidationSchema } from '@config/env.validation';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import redisConfig from '@config/redis.config';
import jwtConfig from '@config/jwt.config';
import googleConfig from '@config/google.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, googleConfig],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true },
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),
    TerminusModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    VocabularyModule,
    LessonModule,
    TestModule,
    AnalyticsModule,
    AdminModule,
    ToeicModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
