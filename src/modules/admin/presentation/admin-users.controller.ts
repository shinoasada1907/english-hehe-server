import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGuard } from '@modules/auth/presentation/guards/jwt.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { UserTypeormEntity } from '@modules/auth/infrastructure/entities/user.typeorm.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Admin / Users')
@ApiBearerAuth('access-token')
@Controller('admin/users')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminUsersController {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepo: Repository<UserTypeormEntity>,
  ) {}

  @ApiOperation({ summary: 'Danh sách users (có phân trang, lọc)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('role') role?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

    const qb = this.userRepo.createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.fullName', 'u.role', 'u.currentLevel',
               'u.streakDays', 'u.totalXp', 'u.isActive', 'u.createdAt'])
      .orderBy('u.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    if (role) qb.andWhere('u.role = :role', { role });
    if (level) qb.andWhere('u.currentLevel = :level', { level });
    if (search) qb.andWhere('(u.email ILIKE :q OR u.fullName ILIKE :q)', { q: `%${search}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: parseInt(page) || 1, limit: take };
  }

  @ApiOperation({ summary: 'Chi tiết user' })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Cập nhật role / level / trạng thái user' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.userRepo.update(id, dto);
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Vô hiệu hóa tài khoản user' })
  @Delete(':id')
  async deactivate(@Param('id') id: string) {
    await this.userRepo.update(id, { isActive: false });
    return { message: 'User deactivated' };
  }
}
