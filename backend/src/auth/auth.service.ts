import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserResponse } from '../schemas/user.schema';

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
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationData> = new Map();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

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
      throw new UnauthorizedException(
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

    // აქ უნდა დაემატოს რეალური ელ-ფოსტის გაგზავნის ლოგიკა

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

    return {
      success: true,
      message: 'Code verified successfully',
    };
  }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({ email });
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
    const payload = { email: user.email, sub: user.id };
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
      throw new UnauthorizedException(
        'This member already exists',
      );
    }

    if (
      !registrationData.verificationCode ||
      !(await this.verifyCode(
        registrationData.email,
        registrationData.verificationCode,
        true, // აქ ვშლით კოდს წარმატებული რეგისტრაციისას
      ))
    ) {
      throw new UnauthorizedException('Invalid verification code');
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
    
    const { password, ...result } = savedUser.toObject();

    return {
      token: this.jwtService.sign({
        email: result.email,
        sub: result._id?.toString() || '',
      }),
      user: {
        id: result._id?.toString() || '',
        name: result.name,
        email: result.email,
        phone: result.phone,
        location: result.location,
        image: result.image,
      },
    };
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
