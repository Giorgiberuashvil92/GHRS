import { IsString, IsNumber, IsBoolean, ValidateNested, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class LocalizedStringDto {
  @IsString()
  en: string;

  @IsString()
  ru: string;
}

class LevelDto {
  @IsNumber()
  exerciseCount: number;

  @IsBoolean()
  isLocked: boolean;
}

class LevelsDto {
  @ValidateNested()
  @Type(() => LevelDto)
  beginner: LevelDto;

  @ValidateNested()
  @Type(() => LevelDto)
  intermediate: LevelDto;

  @ValidateNested()
  @Type(() => LevelDto)
  advanced: LevelDto;
}

class PriceDto {
  @IsNumber()
  monthly: number;

  @IsNumber()
  threeMonths: number;

  @IsNumber()
  sixMonths: number;

  @IsNumber()
  yearly: number;
}

export class CreateSetDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description: LocalizedStringDto;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  recommendations: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  additional?: LocalizedStringDto;

  @IsOptional()
  @IsString()
  demoVideoUrl?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  equipment?: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  warnings?: LocalizedStringDto;

  @IsString()
  thumbnailImage: string;

  @IsOptional()
  @IsNumber()
  totalExercises?: number;

  @IsOptional()
  @IsString()
  totalDuration?: string;

  @IsOptional()
  @IsNumber()
  difficultyLevels?: number;

  @ValidateNested()
  @Type(() => LevelsDto)
  levels: LevelsDto;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  discountedPrice?: PriceDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsMongoId()
  subCategoryId?: string;
} 