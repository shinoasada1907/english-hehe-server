import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpsertVocabularyDto {
  @ApiProperty()
  @IsString()
  word!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipa?: string;

  @ApiProperty()
  @IsString()
  definitionVi!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  definitionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicTags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wordType?: string;
}
