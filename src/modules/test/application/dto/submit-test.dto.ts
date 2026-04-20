import { IsArray, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerItemDto {
  @ApiProperty({ example: 'question-uuid' })
  @IsString()
  questionId!: string;

  @ApiProperty({ example: 1, minimum: 0, maximum: 3, description: 'Index of selected choice (0-3)' })
  @IsInt()
  @Min(0)
  @Max(3)
  answer!: number;
}

export class SubmitTestDto {
  @ApiProperty({ type: [AnswerItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers!: AnswerItemDto[];
}
