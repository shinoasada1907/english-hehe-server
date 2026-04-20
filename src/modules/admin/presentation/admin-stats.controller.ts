import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { LessonTypeormEntity } from '@modules/lesson/infrastructure/entities/lesson.typeorm.entity';
import { TestTypeormEntity } from '@modules/test/infrastructure/entities/test.typeorm.entity';
import { VocabularyTypeormEntity } from '@modules/vocabulary/infrastructure/entities/vocabulary.typeorm.entity';
import { TestResultTypeormEntity } from '@modules/test/infrastructure/entities/test-result.typeorm.entity';

@ApiTags('Admin / Stats')
@ApiBearerAuth('access-token')
@Controller('admin/stats')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminStatsController {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepo: Repository<UserTypeormEntity>,
    @InjectRepository(LessonTypeormEntity)
    private readonly lessonRepo: Repository<LessonTypeormEntity>,
    @InjectRepository(TestTypeormEntity)
    private readonly testRepo: Repository<TestTypeormEntity>,
    @InjectRepository(VocabularyTypeormEntity)
    private readonly vocabRepo: Repository<VocabularyTypeormEntity>,
    @InjectRepository(TestResultTypeormEntity)
    private readonly testResultRepo: Repository<TestResultTypeormEntity>,
  ) {}

  @ApiOperation({ summary: 'Thống kê tổng quan hệ thống' })
  @Get()
  async getStats() {
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      totalLessons,
      publishedLessons,
      totalTests,
      publishedTests,
      totalVocabularies,
      totalTestResults,
    ] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
      this.lessonRepo.count(),
      this.lessonRepo.count({ where: { isPublished: true } }),
      this.testRepo.count(),
      this.testRepo.count({ where: { isPublished: true } }),
      this.vocabRepo.count(),
      this.testResultRepo.count(),
    ]);

    const recentUsers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.createdAt >= :since', { since: since7d })
      .getCount();

    const levelDist = await this.userRepo
      .createQueryBuilder('u')
      .select('u.currentLevel', 'level')
      .addSelect('COUNT(u.id)', 'count')
      .where('u.isActive = true')
      .groupBy('u.currentLevel')
      .getRawMany<{ level: string; count: string }>();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newLast7Days: recentUsers,
        byLevel: Object.fromEntries(levelDist.map((r) => [r.level, parseInt(r.count)])),
      },
      content: {
        lessons: { total: totalLessons, published: publishedLessons },
        tests: { total: totalTests, published: publishedTests },
        vocabularies: totalVocabularies,
      },
      activity: {
        totalTestResults,
      },
    };
  }
}
