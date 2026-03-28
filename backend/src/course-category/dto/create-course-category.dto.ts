import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocalizedStringDto {
  @IsOptional()
  @IsString()
  ka?: string;

  @IsString()
  en: string;

  @IsOptional()
  @IsString()
  ru?: string;
}

export class CreateCourseCategoryDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
