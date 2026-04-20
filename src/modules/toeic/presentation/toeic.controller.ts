import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetToeicTestsUseCase } from '../application/use-cases/get-toeic-tests.use-case';
import { GetToeicDetailUseCase } from '../application/use-cases/get-toeic-detail.use-case';
import { SubmitToeicUseCase } from '../application/use-cases/submit-toeic.use-case';
import { GetToeicHistoryUseCase } from '../application/use-cases/get-toeic-history.use-case';
import { SubmitToeicDto } from '../application/dto/submit-toeic.dto';

@ApiTags('TOEIC')
@ApiBearerAuth('access-token')
@Controller('toeic')
@UseGuards(JwtGuard)
export class ToeicController {
  constructor(
    private readonly getTestsUseCase: GetToeicTestsUseCase,
    private readonly getDetailUseCase: GetToeicDetailUseCase,
    private readonly submitUseCase: SubmitToeicUseCase,
    private readonly getHistoryUseCase: GetToeicHistoryUseCase,
  ) {}

  @ApiOperation({ summary: 'Danh sách đề thi TOEIC' })
  @Get()
  getAll() {
    return this.getTestsUseCase.execute();
  }

  @ApiOperation({ summary: 'Lịch sử thi TOEIC của người dùng' })
  @Get('history')
  getHistory(@CurrentUser() user: { id: string }) {
    return this.getHistoryUseCase.execute(user.id);
  }

  @ApiOperation({ summary: 'Chi tiết đề thi theo parts (KHÔNG có đáp án đúng)' })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.getDetailUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Nộp bài thi TOEIC — chấm điểm server-side, trả về Listening/Reading/Total score' })
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitToeicDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.submitUseCase.execute(user.id, id, dto);
  }
}
