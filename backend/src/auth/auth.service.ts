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
        'მომხმარებელი ამ ელ-ფოსტით უკვე არსებობს',
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
      message: 'ვერიფიკაციის კოდი გაიგზავნა ელ-ფოსტაზე',
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
      throw new UnauthorizedException('არასწორი ან ვადაგასული კოდი');
    }

    return {
      success: true,
      message: 'კოდი წარმატებით დადასტურდა',
    };
  }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('არასწორი ელ-ფოსტა ან პაროლი');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('არასწორი ელ-ფოსტა ან პაროლი');
    }

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
        'მომხმარებელი ამ ელ-ფოსტით უკვე არსებობს',
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
      throw new UnauthorizedException('არასწორი ვერიფიკაციის კოდი');
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
}
