import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonTypeormEntity } from './infrastructure/entities/lesson.typeorm.entity';
import { UserLessonProgressTypeormEntity } from './infrastructure/entities/user-lesson-progress.typeorm.entity';
import { LessonRepository } from './infrastructure/repositories/lesson.repository';
import { UserLessonProgressRepository } from './infrastructure/repositories/user-lesson-progress.repository';
import { LESSON_REPOSITORY } from './domain/lesson.repository.interface';
import { USER_LESSON_PROGRESS_REPOSITORY } from './domain/user-lesson-progress.repository.interface';
import { GetLessonsByLevelUseCase } from './application/use-cases/get-lessons-by-level.use-case';
import { GetLessonDetailUseCase } from './application/use-cases/get-lesson-detail.use-case';
import { CompleteLessonUseCase } from './application/use-cases/complete-lesson.use-case';
import { GetUserLessonProgressUseCase } from './application/use-cases/get-user-lesson-progress.use-case';
import { LessonController } from './presentation/lesson.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonTypeormEntity, UserLessonProgressTypeormEntity]),
    AuthModule,
  ],
  controllers: [LessonController],
  providers: [
    { provide: LESSON_REPOSITORY, useClass: LessonRepository },
    { provide: USER_LESSON_PROGRESS_REPOSITORY, useClass: UserLessonProgressRepository },
    GetLessonsByLevelUseCase,
    GetLessonDetailUseCase,
    CompleteLessonUseCase,
    GetUserLessonProgressUseCase,
  ],
})
export class LessonModule {}
