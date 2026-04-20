import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class UpsertLessonDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level!: string;

  @ApiProperty({ enum: ['grammar', 'reading', 'listening', 'writing', 'speaking'] })
  @IsIn(['grammar', 'reading', 'listening', 'writing', 'speaking'])
  category!: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  contentJson?: Record<string, unknown>;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  xpReward?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
