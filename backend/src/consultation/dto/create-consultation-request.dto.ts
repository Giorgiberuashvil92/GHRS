import { IsString, IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';

export class CreateConsultationRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['en', 'ru', 'ka', 'he', 'ar', 'de', 'fr', 'it', 'uk'])
  locale: string;
}
