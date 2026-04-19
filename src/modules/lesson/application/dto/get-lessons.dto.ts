import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LessonCategory } from '../../domain/lesson.entity';

export class GetLessonsDto {
  @ApiPropertyOptional({ enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
  @IsOptional()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level?: string;

  @ApiPropertyOptional({ enum: ['grammar', 'reading', 'listening', 'writing', 'speaking'] })
  @IsOptional()
  @IsIn(['grammar', 'reading', 'listening', 'writing', 'speaking'])
  category?: LessonCategory;
}
