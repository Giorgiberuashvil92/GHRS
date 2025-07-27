import { IsString, IsNumber, IsOptional, Min, Max, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  courseId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  title: string;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pros?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cons?: string[];
} 