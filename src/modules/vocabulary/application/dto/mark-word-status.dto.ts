import { IsInt, Min, Max } from 'class-validator';

export class MarkWordStatusDto {
  @IsInt()
  @Min(0)
  @Max(5)
  quality!: number;
}
