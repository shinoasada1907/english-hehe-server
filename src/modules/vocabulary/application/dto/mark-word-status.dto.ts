import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkWordStatusDto {
  @ApiProperty({ example: 4, minimum: 0, maximum: 5, description: 'SM-2 quality score (0=blackout, 5=perfect)' })
  @IsInt()
  @Min(0)
  @Max(5)
  quality!: number;
}
