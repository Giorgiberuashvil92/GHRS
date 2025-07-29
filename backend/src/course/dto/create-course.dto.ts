import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsBoolean, ValidateNested, Min, IsUrl, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class MultilingualContent {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsOptional()
  ru?: string;
}

class Announcement {
  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  title: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  content: MultilingualContent;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

class SyllabusItem {
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
  @IsOptional()
  duration?: number;
}

class InstructorInfo {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateCourseDto {
  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  title: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  description: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  shortDescription?: MultilingualContent;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Announcement)
  @IsOptional()
  announcements?: Announcement[];

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  additionalImages?: string[];

  @IsString()
  @IsUrl()
  @IsOptional()
  advertisementImage?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  previewVideoUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  @ValidateNested()
  @Type(() => InstructorInfo)
  @IsNotEmpty()
  instructor: InstructorInfo;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  prerequisites?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  certificateDescription?: MultilingualContent;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultilingualContent)
  @IsOptional()
  learningOutcomes?: MultilingualContent[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyllabusItem)
  @IsOptional()
  syllabus?: SyllabusItem[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  languages: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  subcategoryId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  certificateImages?: string[];
}

export class UpdateCourseDto {
  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  title?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  description?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  shortDescription?: MultilingualContent;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Announcement)
  @IsOptional()
  announcements?: Announcement[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  additionalImages?: string[];

  @IsString()
  @IsUrl()
  @IsOptional()
  advertisementImage?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  previewVideoUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ValidateNested()
  @Type(() => InstructorInfo)
  @IsOptional()
  instructor?: InstructorInfo;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  prerequisites?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  certificateDescription?: MultilingualContent;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultilingualContent)
  @IsOptional()
  learningOutcomes?: MultilingualContent[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyllabusItem)
  @IsOptional()
  syllabus?: SyllabusItem[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  subcategoryId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  certificateImages?: string[];
} 