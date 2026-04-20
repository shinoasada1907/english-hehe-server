import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ enum: ['user', 'admin', 'super_admin'] })
  @IsOptional()
  @IsIn(['user', 'admin', 'super_admin'])
  role?: string;

  @ApiPropertyOptional({ enum: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'] })
  @IsOptional()
  @IsIn(['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'])
  currentLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  dailyGoal?: number;
}
