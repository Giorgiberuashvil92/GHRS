import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

// Legacy user-based instructor endpoints (kept for backward compatibility)
@Controller('legacy-instructors')
export class UserInstructorController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // GET /legacy-instructors/dropdown - ინსტრუქტორების ჩამოსაშლელი სია (legacy)
  @Get('dropdown')
  async getInstructorsForDropdown(): Promise<
    { id: string; name: string; email: string }[]
  > {
    const instructors = await this.userModel
      .find({
        role: 'instructor',
        isActive: true,
      })
      .select('name email')
      .sort({ name: 1 });

    return instructors.map((instructor) => ({
      id: String(instructor._id),
      name: instructor.name,
      email: instructor.email,
    }));
  }

  // GET /legacy-instructors - ყველა ინსტრუქტორი (legacy)
  @Get()
  async getAllInstructors() {
    return this.userModel
      .find({
        role: 'instructor',
        isActive: true,
      })
      .select(
        'name email bio avatar expertise experience education certifications',
      )
      .sort({ name: 1 });
  }

  // POST /legacy-instructors - ახალი ინსტრუქტორის შექმნა (legacy)
  @Post()
  async createInstructor(
    @Body()
    instructorData: {
      name: string;
      email: string;
      bio?: string;
      expertise?: string[];
      experience?: number;
      education?: string;
      certifications?: string[];
    },
  ) {
    const instructor = new this.userModel({
      ...instructorData,
      role: 'instructor',
      isActive: true,
    });
    return instructor.save();
  }
}
