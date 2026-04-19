import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ILessonRepository, LESSON_REPOSITORY, LessonFilter } from '../../domain/lesson.repository.interface';
import { Lesson } from '../../domain/lesson.entity';

@Injectable()
export class GetLessonsByLevelUseCase implements IUseCase<LessonFilter, Lesson[]> {
  constructor(
    @Inject(LESSON_REPOSITORY) private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(filter: LessonFilter): Promise<Lesson[]> {
    return this.lessonRepo.findAll(filter);
  }
}
