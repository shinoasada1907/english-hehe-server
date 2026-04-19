import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonDto {
  @ApiProperty({ example: 85, minimum: 0, maximum: 100, description: 'Score achieved (0–100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;
}
