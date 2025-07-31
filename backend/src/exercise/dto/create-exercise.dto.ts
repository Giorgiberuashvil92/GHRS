import { IsString, IsEnum, IsBoolean, IsOptional, IsNumber, IsMongoId, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class LocalizedStringDto {
  @IsString()
  en: string;

  @IsString()
  ru: string;

  @IsOptional()
  @IsString()
  ka?: string;
}

export class CreateExerciseDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsString()
  videoDuration: string;

  @IsString()
  duration: string;

  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: 'easy' | 'medium' | 'hard';

  @IsString()
  repetitions: string;

  @IsString()
  sets: string;

  @IsString()
  restTime: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsMongoId()
  setId: string;

  @IsMongoId()
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  subCategoryId?: string;
} 