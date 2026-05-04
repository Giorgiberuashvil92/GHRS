import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsBoolean, ValidateNested, Min, IsEmail, IsUrl, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

class MultilingualContent {
  @IsString()
  @IsOptional()
  ka?: string;

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
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  issuer: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl()
  url?: string;
}

class DiplomaInfo {
  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl()
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

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl()
  wikipedia?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  qualificationLocalized?: { en?: string; ru?: string; ka?: string };

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiplomaInfo)
  @IsOptional()
  diplomas?: DiplomaInfo[];

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

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl()
  wikipedia?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  qualificationLocalized?: { en?: string; ru?: string; ka?: string };

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  professionLocalized?: { en?: string; ru?: string; ka?: string };

  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  @IsOptional()
  bio?: OptionalMultilingualContent;

  @ValidateNested()
  @Type(() => OptionalMultilingualContent)
  @IsOptional()
  htmlContent?: OptionalMultilingualContent;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateInfo)
  @IsOptional()
  certificates?: CertificateInfo[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiplomaInfo)
  @IsOptional()
  diplomas?: DiplomaInfo[];

  @IsString()
  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 