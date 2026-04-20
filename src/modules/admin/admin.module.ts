import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { VocabularyTypeormEntity } from '@modules/vocabulary/infrastructure/entities/vocabulary.typeorm.entity';
import { LessonTypeormEntity } from '@modules/lesson/infrastructure/entities/lesson.typeorm.entity';
import { TestTypeormEntity } from '@modules/test/infrastructure/entities/test.typeorm.entity';
import { QuestionTypeormEntity } from '@modules/test/infrastructure/entities/question.typeorm.entity';
import { TestResultTypeormEntity } from '@modules/test/infrastructure/entities/test-result.typeorm.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { AdminUsersController } from './presentation/admin-users.controller';
import { AdminVocabularyController } from './presentation/admin-vocabulary.controller';
import { AdminLessonsController } from './presentation/admin-lessons.controller';
import { AdminTestsController } from './presentation/admin-tests.controller';
import { AdminStatsController } from './presentation/admin-stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeormEntity,
      VocabularyTypeormEntity,
      LessonTypeormEntity,
      TestTypeormEntity,
      QuestionTypeormEntity,
      TestResultTypeormEntity,
    ]),
    AuthModule,
  ],
  controllers: [
    AdminUsersController,
    AdminVocabularyController,
    AdminLessonsController,
    AdminTestsController,
    AdminStatsController,
  ],
})
export class AdminModule {}
