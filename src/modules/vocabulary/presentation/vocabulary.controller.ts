import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetDailyWordsUseCase } from '../application/use-cases/get-daily-words.use-case';
import { GetReviewWordsUseCase } from '../application/use-cases/get-review-words.use-case';
import { MarkWordStatusUseCase } from '../application/use-cases/mark-word-status.use-case';
import { GetVocabularyDetailUseCase } from '../application/use-cases/get-vocabulary-detail.use-case';
import { SearchVocabularyUseCase } from '../application/use-cases/search-vocabulary.use-case';
import { MarkWordStatusDto } from '../application/dto/mark-word-status.dto';
import { SearchVocabularyDto } from '../application/dto/search-vocabulary.dto';

@ApiTags('Vocabulary')
@ApiBearerAuth('access-token')
@Controller('vocab')
@UseGuards(JwtGuard)
export class VocabularyController {
  constructor(
    private readonly getDailyWordsUseCase: GetDailyWordsUseCase,
    private readonly getReviewWordsUseCase: GetReviewWordsUseCase,
    private readonly markWordStatusUseCase: MarkWordStatusUseCase,
    private readonly getVocabularyDetailUseCase: GetVocabularyDetailUseCase,
    private readonly searchVocabularyUseCase: SearchVocabularyUseCase,
  ) {}

  @ApiOperation({ summary: 'Lấy danh sách từ mới hôm nay theo level người dùng (cache Redis 1h)' })
  @Get('daily')
  getDaily(@CurrentUser() user: { id: string }) {
    return this.getDailyWordsUseCase.execute({ userId: user.id });
  }

  @ApiOperation({ summary: 'Lấy danh sách từ cần ôn tập (nextReviewAt <= now)' })
  @Get('review')
  getReview(@CurrentUser() user: { id: string }) {
    return this.getReviewWordsUseCase.execute(user.id);
  }

  @ApiOperation({ summary: 'Tìm kiếm từ vựng theo từ khóa' })
  @Get('search')
  search(@Query() dto: SearchVocabularyDto) {
    return this.searchVocabularyUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Chi tiết một từ vựng' })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.getVocabularyDetailUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Cập nhật tiến độ học từ (SM-2 algorithm)' })
  @Post(':id/status')
  markStatus(
    @Param('id') id: string,
    @Body() dto: MarkWordStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.markWordStatusUseCase.execute({ userId: user.id, vocabularyId: id, quality: dto.quality });
  }
}
