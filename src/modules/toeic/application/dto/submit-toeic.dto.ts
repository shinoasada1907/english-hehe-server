import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class ToeicAnswerItemDto {
  @ApiProperty({ description: 'Question ID' })
  @IsUUID()
  questionId!: string;

  @ApiProperty({ description: 'Đáp án chọn (0-3)', minimum: 0 })
  @IsInt()
  @Min(0)
  answer!: number;
}

export class SubmitToeicDto {
  @ApiProperty({ type: [ToeicAnswerItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToeicAnswerItemDto)
  answers!: ToeicAnswerItemDto[];
}
