import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'; // ← შეცვლილია bcrypt → bcryptjs
import { User, UserDocument, UserResponse } from '../schemas/user.schema';
import { EmailService } from '../email/email.service';

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

interface VerificationData {
  email: string;
  code: string;
  expiresAt: Date;
  verified?: boolean; // Add this flag to track verification status
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationData> = new Map();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async forgotPassword(email: string) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new BadRequestException('Please enter a valid email address');
    }
    const result = { success: true, message: 'If an account exists, a password reset link has been sent.' };
    const user = await this.userModel.findOne({ email: email.trim(), deletedAt: null });
    if (!user) return result;

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) throw new ServiceUnavailableException('Password reset is temporarily unavailable');
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const resetUrl = new URL('/auth/reset-password', frontendUrl);
    resetUrl.searchParams.set('token', token);
    await this.userModel.updateOne({ _id: user._id }, { $set: {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    } });
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Password reset - GHRS',
        html: `<p>პაროლის აღსადგენად / To reset your password / Для сброса пароля:</p><p><a href="${resetUrl.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">Reset password</a></p><p>ბმული მოქმედებს 30 წუთი. / This link expires in 30 minutes. / Ссылка действительна 30 минут.</p><p>If you did not request this, ignore this email.</p>`,
      });
    } catch {
      await this.userModel.updateOne({ _id: user._id, passwordResetTokenHash: tokenHash }, {
        $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
      });
      throw new ServiceUnavailableException('Could not send reset email. Please try again later.');
    }
    return result;
  }

  async resetPassword(token: string, password: string) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
      throw new BadRequestException('Invalid or expired reset link');
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
      throw new BadRequestException('Password must be between 8 and 72 characters');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.findOneAndUpdate({
      passwordResetTokenHash: createHash('sha256').update(token).digest('hex'),
      passwordResetExpiresAt: { $gt: new Date() },
      deletedAt: null,
    }, {
      $set: { password: passwordHash, sessionIds: [] },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset link');
    return { success: true };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async verifyCode(
    email: string,
    code: string,
    deleteIfValid: boolean = false,
  ): Promise<boolean> {
    const verificationData = this.verificationCodes.get(email);

    if (!verificationData) {
      return false;
    }

    if (verificationData.expiresAt < new Date()) {
      this.verificationCodes.delete(email);
      return false;
    }

    if (verificationData.code !== code) {
      return false;
    }

    if (deleteIfValid) {
      this.verificationCodes.delete(email);
    }
    return true;
  }

  async sendVerificationCode(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        'This member already exists',
      );
    }

    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 წუთი

    this.verificationCodes.set(email, {
      email,
      code,
      expiresAt,
    });

    // Send verification code via email
    try {
      await this.emailService.sendVerificationCode(email, code);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Still return success as the code is generated and stored
      // The user can request a resend if needed
    }

    return {
      success: true,
      message: 'Verification code sent to email',
    };
  }

  async resendVerificationCode(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.sendVerificationCode(email);
  }

  async verifyEmailCode(
    email: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    const isValid = await this.verifyCode(email, code);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Mark the email as verified without consuming the code
    const verificationData = this.verificationCodes.get(email);
    if (verificationData) {
      verificationData.verified = true;
      this.verificationCodes.set(email, verificationData);
    }

    return {
      success: true,
      message: 'Code verified successfully',
    };
  }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({ email, deletedAt: null });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ავტომატური achievements-ების ინიციალიზაცია
    await this.initializeUserAchievements(user);

    const { password: _, ...result } = user.toObject();
    return {
      id: result._id?.toString() || '',
      name: result.name,
      email: result.email,
      phone: result.phone,
      location: result.location,
      image: result.image,
    };
  }

  async login(user: UserResponse) {
    const sessionId = randomBytes(32).toString('hex');
    const result = await this.userModel.updateOne({ _id: user.id, deletedAt: null }, { $push: { sessionIds: sessionId } });
    if (!result.matchedCount) throw new UnauthorizedException('Account unavailable');
    const payload = { email: user.email, sub: user.id, sid: sessionId };
    const token = await this.jwtService.sign(payload);
    return {
      token,
      user,
    };
  }

  async register(registrationData: RegistrationDto) {
    const existingUser = await this.userModel.findOne({
      email: registrationData.email,
    });
    if (existingUser) {
      throw new ConflictException(
        'This member already exists',
      );
    }

    // Check if email is verified (either by code or by verification step)
    const verificationData = this.verificationCodes.get(registrationData.email);
    const isEmailVerified = verificationData?.verified === true;
    
    if (!isEmailVerified) {
      throw new UnauthorizedException('Email not verified. Please complete email verification first.');
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const newUser = new this.userModel({
      email: registrationData.email,
      password: hashedPassword,
      name: registrationData.name,
      phone: registrationData.phone,
      location: registrationData.location,
      diseases: registrationData.diseases,
      additionalInfo: registrationData.additionalInfo,
    });

    const savedUser = await newUser.save();
    
    // ახალი მომხმარებლისთვის achievements-ების ინიციალიზაცია
    await this.initializeUserAchievements(savedUser);
    
    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(savedUser.email, savedUser.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail registration if welcome email fails
    }
    
    // Clean up verification data after successful registration
    this.verificationCodes.delete(registrationData.email);
    
    const { password, ...result } = savedUser.toObject();

    return this.login({
      id: result._id?.toString() || '', name: result.name, email: result.email,
      phone: result.phone, location: result.location, image: result.image,
    });
  }

  async restoreSession(userId: string, sessionId?: string) {
    const user = await this.userModel.findOne({ _id: userId, deletedAt: null }).select('_id name email phone location image');
    if (!user) throw new UnauthorizedException();
    const userData: UserResponse = {
      id: user._id.toString(), name: user.name, email: user.email,
      phone: user.phone, location: user.location, image: user.image,
    };
    // Existing unexpired tokens migrate to persistent sessions without another login.
    if (!sessionId) return this.login(userData);
    return { user: userData };
  }

  async logout(userId: string, sessionId?: string) {
    if (sessionId) await this.userModel.updateOne({ _id: userId }, { $pull: { sessionIds: sessionId } });
    return { success: true };
  }

  // ახალი მეთოდი achievements-ების ინიციალიზაციისთვის
  private async initializeUserAchievements(user: UserDocument) {
    // თუ უკვე აქვს achievements, არაფერი არ გავაკეთოთ
    if (user.achievements && user.achievements.length > 0) {
      return;
    }

    // საწყისი სტატისტიკის ინიციალიზაცია
    if (!user.statistics) {
      user.statistics = {
        totalTimeSpent: 0,
        totalExercisesCompleted: 0,
        currentStreak: 0,
        recordStreak: 0,
        totalSetsCompleted: 0,
        totalCoursesCompleted: 0,
        completedExerciseIds: [],
        completedSetIds: [],
        completedCourseIds: [],
        activityDates: [],
      } as any;
    }

    const demoAchievements = [
      {
        id: 'welcome',
        title: {
          en: 'Welcome!',
          ru: 'Добро пожаловать!',
          ka: 'კეთილი იყოს თქვენი მობრძანება!'
        },
        description: {
          en: 'You joined our platform',
          ru: 'Вы присоединились к нашей платформе',
          ka: 'თქვენ შეუერთდით ჩვენს პლატფორმას'
        },
        current: 1,
        total: 1,
        isCompleted: true,
        image: '/assets/icons/Icon.svg',
        imageBg: '#D4BAFC',
        unlockedAt: new Date(),
        completedAt: new Date()
      },
      {
        id: 'first-exercise',
        title: {
          en: 'First Exercise',
          ru: 'Первое упражнение',
          ka: 'პირველი ვარჯიში'
        },
        description: {
          en: 'Complete your first exercise',
          ru: 'Завершите первое упражнение',
          ka: 'დაასრულეთ პირველი ვარჯიში'
        },
        current: 0,
        total: 1,
        isCompleted: false,
        image: '/assets/icons/play.svg',
        imageBg: '#F3D57F'
      },
      {
        id: 'five-day-streak',
        title: {
          en: '5 Day Streak',
          ru: '5 дней подряд',
          ka: '5 დღე ზედიზედ'
        },
        description: {
          en: 'Exercise for 5 days in a row',
          ru: 'Тренируйтесь 5 дней подряд',
          ka: 'ივარჯიშეთ 5 დღე ზედიზედ'
        },
        current: 0,
        total: 5,
        isCompleted: false,
        image: '/assets/icons/heat.svg',
        imageBg: '#B1E5FC'
      },
      {
        id: 'professional',
        title: {
          en: 'Professional',
          ru: 'Профессионал',
          ka: 'პროფესიონალი'
        },
        description: {
          en: 'Complete 50 exercises',
          ru: 'Завершите 50 упражнений',
          ka: 'დაასრულეთ 50 ვარჯიში'
        },
        current: 0,
        total: 50,
        isCompleted: false,
        image: '/assets/icons/pulse.svg',
        imageBg: '#FFD700'
      }
    ];

    user.achievements = demoAchievements as any;
    await user.save();
  }
}
