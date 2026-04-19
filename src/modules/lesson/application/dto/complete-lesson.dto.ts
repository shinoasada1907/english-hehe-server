import { IsInt, Min, Max } from 'class-validator';

export class CompleteLessonDto {
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;
}
