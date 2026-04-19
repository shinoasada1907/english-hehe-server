import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from '@modules/auth/auth.module';
import { VocabularyModule } from '@modules/vocabulary/vocabulary.module';
import { LessonModule } from '@modules/lesson/lesson.module';
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
    DatabaseModule,
    RedisModule,
    AuthModule,
    VocabularyModule,
    LessonModule,
  ],
})
export class AppModule {}
