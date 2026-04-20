import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { VocabularyTypeormEntity } from '@modules/vocabulary/infrastructure/entities/vocabulary.typeorm.entity';
import { UpsertVocabularyDto } from '../dto/upsert-vocabulary.dto';

@ApiTags('Admin / Vocabulary')
@ApiBearerAuth('access-token')
@Controller('admin/vocabularies')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminVocabularyController {
  constructor(
    @InjectRepository(VocabularyTypeormEntity)
    private readonly vocabRepo: Repository<VocabularyTypeormEntity>,
  ) {}

  @ApiOperation({ summary: 'Danh sách từ vựng (phân trang, lọc theo level)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

    const qb = this.vocabRepo.createQueryBuilder('v')
      .orderBy('v.level', 'ASC')
      .addOrderBy('v.word', 'ASC')
      .skip(skip)
      .take(take);

    if (level) qb.andWhere('v.level = :level', { level });
    if (search) qb.andWhere('v.word ILIKE :q', { q: `%${search}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: parseInt(page) || 1, limit: take };
  }

  @ApiOperation({ summary: 'Tạo từ vựng mới' })
  @Post()
  create(@Body() dto: UpsertVocabularyDto) {
    const entity = this.vocabRepo.create({
      word: dto.word,
      ipa: dto.ipa ?? '',
      definitionVi: dto.definitionVi,
      definitionEn: dto.definitionEn ?? '',
      exampleSentence: dto.exampleSentence ?? '',
      audioUrl: dto.audioUrl ?? '',
      imageUrl: dto.imageUrl ?? null,
      level: dto.level,
      topicTags: dto.topicTags ?? [],
      wordType: dto.wordType ?? 'noun',
    });
    return this.vocabRepo.save(entity);
  }

  @ApiOperation({ summary: 'Cập nhật từ vựng' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpsertVocabularyDto>) {
    await this.vocabRepo.update(id, dto as object);
    return this.vocabRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Xóa từ vựng' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.vocabRepo.delete(id);
    return { message: 'Vocabulary deleted' };
  }
}
