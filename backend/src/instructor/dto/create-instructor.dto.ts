import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsBoolean, ValidateNested, Min, IsEmail, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

class MultilingualContent {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;
}

class OptionalMultilingualContent {
  @IsString()
  @IsOptional()
  en?: string;

  @IsString()
  @IsOptional()
  ru?: string;

  @IsString()
  @IsOptional()
  ka?: string;
}

class CertificateInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  issuer: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  url?: string;
}



export class CreateInstructorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  firstNameLocalized?: OptionalMultilingualContent;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  lastNameLocalized?: OptionalMultilingualContent;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  profession: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  professionLocalized?: { en?: string; ru?: string; ka?: string };

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsNotEmpty()
  bio: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  htmlContent?: MultilingualContent;



  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateInfo)
  @IsOptional()
  certificates?: CertificateInfo[];

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  profileImage: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateInstructorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  firstNameLocalized?: OptionalMultilingualContent;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  lastNameLocalized?: OptionalMultilingualContent;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  professionLocalized?: { en?: string; ru?: string; ka?: string };

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  bio?: MultilingualContent;

  @ValidateNested()
  @Type(() => MultilingualContent)
  @IsOptional()
  htmlContent?: MultilingualContent;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateInfo)
  @IsOptional()
  certificates?: CertificateInfo[];

  @IsString()
  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 