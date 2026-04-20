import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString,
  Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminQuestionDto {
  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty({ type: [String], minItems: 2 })
  @IsArray()
  @IsString({ each: true })
  choices!: string[];

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  correctAnswer!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}

export class UpsertTestDto {
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

  @ApiProperty({ enum: ['grammar', 'reading', 'listening', 'vocabulary', 'mixed'] })
  @IsIn(['grammar', 'reading', 'listening', 'vocabulary', 'mixed'])
  category!: string;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxXp?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [AdminQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminQuestionDto)
  questions?: AdminQuestionDto[];
}
