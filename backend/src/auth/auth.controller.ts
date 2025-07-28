import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserResponse } from '../schemas/user.schema';

interface LoginRequest {
  user: UserResponse;
}

interface RegistrationDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  diseases?: string[];
  additionalInfo?: string;
  verificationCode?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Request() req: LoginRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() registrationData: RegistrationDto) {
    return this.authService.register(registrationData);
  }

  @Post('send-verification')
  @HttpCode(200)
  async sendVerificationCode(@Body() { email }: { email: string }) {
    return this.authService.sendVerificationCode(email);
  }

  @Post('verify-code')
  @HttpCode(200)
  async verifyCode(@Body() { email, code }: { email: string; code: string }) {
    return this.authService.verifyEmailCode(email, code);
  }

  @Post('resend-code')
  @HttpCode(200)
  async resendVerificationCode(@Body() { email }: { email: string }) {
    return this.authService.resendVerificationCode(email);
  }
}
