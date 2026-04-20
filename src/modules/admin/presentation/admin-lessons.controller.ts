import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { LessonTypeormEntity } from '@modules/lesson/infrastructure/entities/lesson.typeorm.entity';
import { UpsertLessonDto } from '../dto/upsert-lesson.dto';

@ApiTags('Admin / Lessons')
@ApiBearerAuth('access-token')
@Controller('admin/lessons')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminLessonsController {
  constructor(
    @InjectRepository(LessonTypeormEntity)
    private readonly lessonRepo: Repository<LessonTypeormEntity>,
  ) {}

  @ApiOperation({ summary: 'Danh sách lessons (phân trang, lọc)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('level') level?: string,
    @Query('category') category?: string,
    @Query('published') published?: string,
  ) {
    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

    const qb = this.lessonRepo.createQueryBuilder('l')
      .orderBy('l.level', 'ASC')
      .addOrderBy('l.orderIndex', 'ASC')
      .skip(skip)
      .take(take);

    if (level) qb.andWhere('l.level = :level', { level });
    if (category) qb.andWhere('l.category = :category', { category });
    if (published !== undefined) qb.andWhere('l.isPublished = :published', { published: published === 'true' });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: parseInt(page) || 1, limit: take };
  }

  @ApiOperation({ summary: 'Chi tiết lesson' })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.lessonRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Tạo lesson mới' })
  @Post()
  create(@Body() dto: UpsertLessonDto) {
    const entity = this.lessonRepo.create({
      title: dto.title,
      description: dto.description ?? '',
      level: dto.level,
      category: dto.category,
      contentJson: dto.contentJson ?? {},
      orderIndex: dto.orderIndex ?? 0,
      xpReward: dto.xpReward ?? 10,
      isPublished: dto.isPublished ?? false,
    });
    return this.lessonRepo.save(entity);
  }

  @ApiOperation({ summary: 'Cập nhật lesson (bao gồm publish/unpublish)' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpsertLessonDto>) {
    await this.lessonRepo.update(id, dto as object);
    return this.lessonRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Xóa lesson' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.lessonRepo.delete(id);
    return { message: 'Lesson deleted' };
  }
}
