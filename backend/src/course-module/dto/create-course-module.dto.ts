import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class MultilingualContent {
  @IsString()
  @IsNotEmpty()
  ka: string;

  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;
}

export class CreateCourseModuleDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  title: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  description: MultilingualContent;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateCourseModuleDto {
  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  title?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  description?: MultilingualContent;

  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
} 