import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { AnalyticsService } from '../application/analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Tổng quan tiến độ học của người dùng' })
  @Get('dashboard')
  getDashboard(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getDashboard(user.id);
  }

  @ApiOperation({ summary: 'Lịch sử XP theo ngày (mặc định 30 ngày gần nhất)' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @Get('xp-history')
  getXpHistory(
    @CurrentUser() user: { id: string },
    @Query('days') days?: string,
  ) {
    const numDays = Math.min(Math.max(parseInt(days ?? '30') || 30, 1), 365);
    return this.analyticsService.getXpHistory(user.id, numDays);
  }

  @ApiOperation({ summary: 'Hiệu suất làm bài test theo category và level' })
  @Get('test-performance')
  getTestPerformance(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getTestPerformance(user.id);
  }

  @ApiOperation({ summary: 'Tiến độ học từ vựng theo trạng thái và level' })
  @Get('vocabulary-progress')
  getVocabularyProgress(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getVocabularyProgress(user.id);
  }
}
