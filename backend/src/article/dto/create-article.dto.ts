import { IsString, IsObject, IsArray, IsBoolean, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocalizedStringDto {
  @IsString()
  ka: string;

  @IsOptional()
  @IsString()
  en: string;

  @IsOptional()
  @IsString()
  ru: string;
}

export class TableOfContentItemDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @IsString()
  anchor: string;
}

export class AuthorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class CreateArticleDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  excerpt: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  content: LocalizedStringDto;

  @IsString()
  blogId: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuredImages?: string[];

  @ValidateNested()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @IsString()
  readTime: string;

  @IsOptional()
  @IsNumber()
  commentsCount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableOfContentItemDto)
  tableOfContents?: TableOfContentItemDto[];

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