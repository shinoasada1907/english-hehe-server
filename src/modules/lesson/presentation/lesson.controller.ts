import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetLessonsByLevelUseCase } from '../application/use-cases/get-lessons-by-level.use-case';
import { GetLessonDetailUseCase } from '../application/use-cases/get-lesson-detail.use-case';
import { CompleteLessonUseCase } from '../application/use-cases/complete-lesson.use-case';
import { GetUserLessonProgressUseCase } from '../application/use-cases/get-user-lesson-progress.use-case';
import { GetLessonsDto } from '../application/dto/get-lessons.dto';
import { CompleteLessonDto } from '../application/dto/complete-lesson.dto';

@ApiTags('Lessons')
@ApiBearerAuth('access-token')
@Controller('lessons')
@UseGuards(JwtGuard)
export class LessonController {
  constructor(
    private readonly getLessonsByLevelUseCase: GetLessonsByLevelUseCase,
    private readonly getLessonDetailUseCase: GetLessonDetailUseCase,
    private readonly completeLessonUseCase: CompleteLessonUseCase,
    private readonly getUserLessonProgressUseCase: GetUserLessonProgressUseCase,
  ) {}

  @ApiOperation({ summary: 'Danh sách bài học (lọc theo level và category)' })
  @Get()
  getAll(@Query() dto: GetLessonsDto) {
    return this.getLessonsByLevelUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Progress tất cả bài học của người dùng' })
  @Get('progress')
  getProgress(@CurrentUser() user: { id: string }) {
    return this.getUserLessonProgressUseCase.execute(user.id);
  }

  @ApiOperation({ summary: 'Chi tiết bài học + nội dung JSON' })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.getLessonDetailUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Đánh dấu hoàn thành bài học và cộng XP' })
  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Body() dto: CompleteLessonDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.completeLessonUseCase.execute({ userId: user.id, lessonId: id, score: dto.score });
  }
}
