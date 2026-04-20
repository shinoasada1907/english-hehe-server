import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { TestResultTypeormEntity } from '@modules/test/infrastructure/entities/test-result.typeorm.entity';
import { UserLessonProgressTypeormEntity } from '@modules/lesson/infrastructure/entities/user-lesson-progress.typeorm.entity';
import { UserVocabularyProgressTypeormEntity } from '@modules/vocabulary/infrastructure/entities/user-vocabulary-progress.typeorm.entity';
import { VocabularyTypeormEntity } from '@modules/vocabulary/infrastructure/entities/vocabulary.typeorm.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { AnalyticsService } from './application/analytics.service';
import { AnalyticsController } from './presentation/analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeormEntity,
      TestResultTypeormEntity,
      UserLessonProgressTypeormEntity,
      UserVocabularyProgressTypeormEntity,
      VocabularyTypeormEntity,
    ]),
    AuthModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
