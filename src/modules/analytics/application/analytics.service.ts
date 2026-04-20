import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { TestResultTypeormEntity } from '@modules/test/infrastructure/entities/test-result.typeorm.entity';
import { UserLessonProgressTypeormEntity } from '@modules/lesson/infrastructure/entities/user-lesson-progress.typeorm.entity';
import { UserVocabularyProgressTypeormEntity } from '@modules/vocabulary/infrastructure/entities/user-vocabulary-progress.typeorm.entity';
import { VocabularyTypeormEntity } from '@modules/vocabulary/infrastructure/entities/vocabulary.typeorm.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepo: Repository<UserTypeormEntity>,
    @InjectRepository(TestResultTypeormEntity)
    private readonly testResultRepo: Repository<TestResultTypeormEntity>,
    @InjectRepository(UserLessonProgressTypeormEntity)
    private readonly lessonProgressRepo: Repository<UserLessonProgressTypeormEntity>,
    @InjectRepository(UserVocabularyProgressTypeormEntity)
    private readonly vocabProgressRepo: Repository<UserVocabularyProgressTypeormEntity>,
    @InjectRepository(VocabularyTypeormEntity)
    private readonly vocabRepo: Repository<VocabularyTypeormEntity>,
  ) {}

  async getDashboard(userId: string) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    const [vocabStats, lessonStats, testStats] = await Promise.all([
      this.getVocabStats(userId),
      this.getLessonStats(userId),
      this.getTestStats(userId),
    ]);

    return {
      totalXp: user.totalXp,
      streakDays: user.streakDays,
      currentLevel: user.currentLevel,
      dailyGoal: user.dailyGoal,
      vocabStats,
      lessonStats,
      testStats,
    };
  }

  async getXpHistory(userId: string, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const [testRows, lessonRows] = await Promise.all([
      this.testResultRepo
        .createQueryBuilder('tr')
        .select("DATE(tr.completed_at AT TIME ZONE 'UTC')", 'date')
        .addSelect('SUM(tr.xp_earned)', 'xp')
        .where('tr.user_id = :userId', { userId })
        .andWhere('tr.completed_at >= :since', { since })
        .groupBy("DATE(tr.completed_at AT TIME ZONE 'UTC')")
        .getRawMany<{ date: string; xp: string }>(),

      this.lessonProgressRepo
        .createQueryBuilder('lp')
        .select("DATE(lp.completed_at AT TIME ZONE 'UTC')", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('lp.user_id = :userId', { userId })
        .andWhere('lp.completed = true')
        .andWhere('lp.completed_at >= :since', { since })
        .groupBy("DATE(lp.completed_at AT TIME ZONE 'UTC')")
        .getRawMany<{ date: string; count: string }>(),
    ]);

    const lessonXpMap: Record<string, number> = {};
    for (const row of lessonRows) {
      lessonXpMap[row.date] = parseInt(row.count) * 10;
    }

    const testXpMap: Record<string, number> = {};
    for (const row of testRows) {
      testXpMap[row.date] = parseInt(row.xp);
    }

    const allDates = Array.from(
      new Set([...Object.keys(testXpMap), ...Object.keys(lessonXpMap)]),
    ).sort();

    return {
      days,
      history: allDates.map((date) => ({
        date,
        xpFromTests: testXpMap[date] ?? 0,
        xpFromLessons: lessonXpMap[date] ?? 0,
        total: (testXpMap[date] ?? 0) + (lessonXpMap[date] ?? 0),
      })),
    };
  }

  async getTestPerformance(userId: string) {
    const rows = await this.testResultRepo
      .createQueryBuilder('tr')
      .innerJoin('tr.test', 't')
      .select('t.category', 'category')
      .addSelect('t.level', 'level')
      .addSelect('COUNT(tr.id)', 'taken')
      .addSelect('AVG(tr.score)', 'avgScore')
      .addSelect('SUM(tr.xp_earned)', 'totalXp')
      .where('tr.user_id = :userId', { userId })
      .groupBy('t.category')
      .addGroupBy('t.level')
      .getRawMany<{ category: string; level: string; taken: string; avgScore: string; totalXp: string }>();

    return {
      byCategory: rows.map((r) => ({
        category: r.category,
        level: r.level,
        taken: parseInt(r.taken),
        avgScore: Math.round(parseFloat(r.avgScore) * 10) / 10,
        totalXp: parseInt(r.totalXp),
      })),
    };
  }

  async getVocabularyProgress(userId: string) {
    const rows = await this.vocabProgressRepo
      .createQueryBuilder('vp')
      .innerJoin('vp.vocabulary', 'v')
      .select('vp.status', 'status')
      .addSelect('v.level', 'level')
      .addSelect('COUNT(vp.id)', 'count')
      .where('vp.user_id = :userId', { userId })
      .groupBy('vp.status')
      .addGroupBy('v.level')
      .getRawMany<{ status: string; level: string; count: string }>();

    const byStatus: Record<string, number> = {};
    const byLevel: Record<string, number> = {};
    let total = 0;

    for (const r of rows) {
      const count = parseInt(r.count);
      byStatus[r.status] = (byStatus[r.status] ?? 0) + count;
      byLevel[r.level] = (byLevel[r.level] ?? 0) + count;
      total += count;
    }

    return { total, byStatus, byLevel };
  }

  private async getVocabStats(userId: string) {
    const rows = await this.vocabProgressRepo
      .createQueryBuilder('vp')
      .select('vp.status', 'status')
      .addSelect('COUNT(vp.id)', 'count')
      .where('vp.user_id = :userId', { userId })
      .groupBy('vp.status')
      .getRawMany<{ status: string; count: string }>();

    const result: Record<string, number> = { total: 0 };
    for (const r of rows) {
      result[r.status] = parseInt(r.count);
      result['total'] += parseInt(r.count);
    }
    return result;
  }

  private async getLessonStats(userId: string) {
    const [completed, totalAvailable] = await Promise.all([
      this.lessonProgressRepo.count({ where: { userId, completed: true } }),
      this.lessonProgressRepo.count({ where: { userId } }),
    ]);
    return { completed, totalAvailable };
  }

  private async getTestStats(userId: string) {
    const rows = await this.testResultRepo
      .createQueryBuilder('tr')
      .select('COUNT(tr.id)', 'taken')
      .addSelect('AVG(tr.score)', 'avgScore')
      .where('tr.user_id = :userId', { userId })
      .getRawOne<{ taken: string; avgScore: string | null }>();

    return {
      taken: parseInt(rows?.taken ?? '0'),
      avgScore: rows?.avgScore ? Math.round(parseFloat(rows.avgScore) * 10) / 10 : 0,
    };
  }
}
