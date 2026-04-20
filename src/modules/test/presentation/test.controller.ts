import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetTestsUseCase } from '../application/use-cases/get-tests.use-case';
import { GetTestDetailUseCase } from '../application/use-cases/get-test-detail.use-case';
import { SubmitTestUseCase } from '../application/use-cases/submit-test.use-case';
import { GetTestHistoryUseCase } from '../application/use-cases/get-test-history.use-case';
import { SubmitTestDto } from '../application/dto/submit-test.dto';

@ApiTags('Tests')
@ApiBearerAuth('access-token')
@Controller('tests')
@UseGuards(JwtGuard)
export class TestController {
  constructor(
    private readonly getTestsUseCase: GetTestsUseCase,
    private readonly getTestDetailUseCase: GetTestDetailUseCase,
    private readonly submitTestUseCase: SubmitTestUseCase,
    private readonly getTestHistoryUseCase: GetTestHistoryUseCase,
  ) {}

  @ApiOperation({ summary: 'Danh sách bài test (lọc theo level và category)' })
  @Get()
  getAll(@Query('level') level?: string, @Query('category') category?: string) {
    return this.getTestsUseCase.execute({ level, category });
  }

  @ApiOperation({ summary: 'Lịch sử làm test của người dùng (sort mới nhất)' })
  @Get('history')
  getHistory(@CurrentUser() user: { id: string }) {
    return this.getTestHistoryUseCase.execute(user.id);
  }

  @ApiOperation({ summary: 'Chi tiết bài test + câu hỏi (KHÔNG có đáp án đúng)' })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.getTestDetailUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Nộp bài — chấm điểm server-side, nhận kết quả + XP' })
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitTestDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.submitTestUseCase.execute({ userId: user.id, testId: id, dto });
  }
}
