import { IsOptional, IsIn } from 'class-validator';
import { LessonCategory } from '../../domain/lesson.entity';

export class GetLessonsDto {
  @IsOptional()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level?: string;

  @IsOptional()
  @IsIn(['grammar', 'reading', 'listening', 'writing', 'speaking'])
  category?: LessonCategory;
}
