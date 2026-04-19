import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from '@shared/application/base.use-case';
import { ILessonRepository, LESSON_REPOSITORY } from '../../domain/lesson.repository.interface';
import { Lesson } from '../../domain/lesson.entity';

@Injectable()
export class GetLessonDetailUseCase implements IUseCase<string, Lesson> {
  constructor(
    @Inject(LESSON_REPOSITORY) private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepo.findById(id);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }
}
