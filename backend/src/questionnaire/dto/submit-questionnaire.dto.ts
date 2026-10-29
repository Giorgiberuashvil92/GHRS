import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;
export class SubmitQuestionnaireDto {
  @IsIn(['en', 'ru']) locale: 'en' | 'ru';
  @IsIn(['rehabilitation', 'professional']) purpose: 'rehabilitation' | 'professional';
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(80) nickname: string;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(200) fullName?: string;
  @Transform(trim) @IsString() @Matches(/^\+?[\d ()-]{7,30}$/) phone: string;
  @Transform(trim) @IsOptional() @IsEmail() @MaxLength(254) email?: string;
  @IsOptional() @IsIn(['female', 'male', 'other', 'prefer-not-to-say']) gender?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 0 }) @Min(1) @Max(120) age?: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 1 }) @Min(1) @Max(500) weight?: number;
  @IsOptional() @IsIn(['beginner', 'intermediate', 'advanced']) trainingLevel?: string;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(100) conditionId?: string;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(2000) conditionDetails?: string;
  @Transform(trim) @IsOptional() @IsString() @MaxLength(5000) additionalInfo?: string;
  @IsBoolean() @IsIn([true]) consent: boolean;
}
