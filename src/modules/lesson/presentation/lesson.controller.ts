import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetLessonsByLevelUseCase } from '../application/use-cases/get-lessons-by-level.use-case';
import { GetLessonDetailUseCase } from '../application/use-cases/get-lesson-detail.use-case';
import { CompleteLessonUseCase } from '../application/use-cases/complete-lesson.use-case';
import { GetUserLessonProgressUseCase } from '../application/use-cases/get-user-lesson-progress.use-case';
import { GetLessonsDto } from '../application/dto/get-lessons.dto';
import { CompleteLessonDto } from '../application/dto/complete-lesson.dto';

@Controller('lessons')
@UseGuards(JwtGuard)
export class LessonController {
  constructor(
    private readonly getLessonsByLevelUseCase: GetLessonsByLevelUseCase,
    private readonly getLessonDetailUseCase: GetLessonDetailUseCase,
    private readonly completeLessonUseCase: CompleteLessonUseCase,
    private readonly getUserLessonProgressUseCase: GetUserLessonProgressUseCase,
  ) {}

  @Get()
  getAll(@Query() dto: GetLessonsDto) {
    return this.getLessonsByLevelUseCase.execute(dto);
  }

  @Get('progress')
  getProgress(@CurrentUser() user: { id: string }) {
    return this.getUserLessonProgressUseCase.execute(user.id);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.getLessonDetailUseCase.execute(id);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Body() dto: CompleteLessonDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.completeLessonUseCase.execute({ userId: user.id, lessonId: id, score: dto.score });
  }
}
