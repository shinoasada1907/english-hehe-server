import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { TestTypeormEntity } from '@modules/test/infrastructure/entities/test.typeorm.entity';
import { QuestionTypeormEntity } from '@modules/test/infrastructure/entities/question.typeorm.entity';
import { UpsertTestDto } from '../dto/upsert-test.dto';

@ApiTags('Admin / Tests')
@ApiBearerAuth('access-token')
@Controller('admin/tests')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminTestsController {
  constructor(
    @InjectRepository(TestTypeormEntity)
    private readonly testRepo: Repository<TestTypeormEntity>,
    @InjectRepository(QuestionTypeormEntity)
    private readonly questionRepo: Repository<QuestionTypeormEntity>,
    private readonly dataSource: DataSource,
  ) {}

  @ApiOperation({ summary: 'Danh sách tests (phân trang, lọc)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'category', required: false })
  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('level') level?: string,
    @Query('category') category?: string,
  ) {
    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

    const qb = this.testRepo.createQueryBuilder('t')
      .orderBy('t.level', 'ASC')
      .skip(skip)
      .take(take);

    if (level) qb.andWhere('t.level = :level', { level });
    if (category) qb.andWhere('t.category = :category', { category });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: parseInt(page) || 1, limit: take };
  }

  @ApiOperation({ summary: 'Chi tiết test kèm câu hỏi (bao gồm đáp án — admin only)' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const test = await this.testRepo.findOneOrFail({ where: { id } });
    const questions = await this.questionRepo.find({
      where: { testId: id },
      order: { orderIndex: 'ASC' },
    });
    return { ...test, questions };
  }

  @ApiOperation({ summary: 'Tạo test mới kèm câu hỏi' })
  @Post()
  async create(@Body() dto: UpsertTestDto) {
    return this.dataSource.transaction(async (manager) => {
      const test = manager.create(TestTypeormEntity, {
        title: dto.title,
        description: dto.description ?? '',
        level: dto.level,
        category: dto.category,
        timeLimit: dto.timeLimit ?? 30,
        maxXp: dto.maxXp ?? 50,
        isPublished: dto.isPublished ?? false,
      });
      const savedTest = await manager.save(TestTypeormEntity, test);

      if (dto.questions?.length) {
        const questions = dto.questions.map((q, i) =>
          manager.create(QuestionTypeormEntity, {
            testId: savedTest.id,
            content: q.content,
            choices: q.choices,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation ?? null,
            orderIndex: q.orderIndex ?? i,
          }),
        );
        await manager.save(QuestionTypeormEntity, questions);
      }

      return savedTest;
    });
  }

  @ApiOperation({ summary: 'Cập nhật metadata test (publish/unpublish, timeLimit, v.v.)' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpsertTestDto>) {
    const { questions, ...testData } = dto;
    if (Object.keys(testData).length) {
      await this.testRepo.update(id, testData as object);
    }
    return this.testRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Xóa test (cascade xóa câu hỏi + kết quả)' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.testRepo.delete(id);
    return { message: 'Test deleted' };
  }
}
