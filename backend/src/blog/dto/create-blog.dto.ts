import { IsString, IsArray, IsBoolean, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocalizedStringDto {
  @IsString()
  ka: string;

  @IsString()
  en: string;

  @IsString()
  ru: string;
}

export class CreateBlogDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  excerpt: LocalizedStringDto;

  @IsString()
  imageUrl: string;

  @IsString()
  categoryId: string;

  @IsString()
  link: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  publishDate?: Date;

  @IsOptional()
  @IsNumber()
  viewsCount?: number;

  @IsOptional()
  @IsNumber()
  likesCount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
} 