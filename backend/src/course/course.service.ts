import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';

interface FindAllOptions {
  page: number;
  limit: number;
  isPublished?: boolean;
  categoryId?: string;
  subcategoryId?: string;
  instructorId?: string;
  search?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Check if category exists
      const categoryExists = await this.courseModel.db.model('Category').findById(createCourseDto.categoryId);
      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      // Check subcategory if provided
      if (createCourseDto.subcategoryId) {
        const subcategoryExists = await this.courseModel.db.model('Category').findOne({
          _id: createCourseDto.subcategoryId,
          parentId: createCourseDto.categoryId
        });
        if (!subcategoryExists) {
          throw new NotFoundException('Subcategory not found or does not belong to the specified category');
        }
      }

      // Create course with default values
      const courseData = {
        ...createCourseDto,
        certificateImages: createCourseDto.certificateImages || [],
        announcements: createCourseDto.announcements || [],
        additionalImages: createCourseDto.additionalImages || [],
        learningOutcomes: createCourseDto.learningOutcomes || [],
        syllabus: createCourseDto.syllabus || [],
        tags: createCourseDto.tags || [],
        startDate: createCourseDto.startDate ? new Date(createCourseDto.startDate) : undefined,
        endDate: createCourseDto.endDate ? new Date(createCourseDto.endDate) : undefined,
      };

      const course = new this.courseModel(courseData);
      return await course.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create course: ' + error.message);
    }
  }

  async findAll(options: FindAllOptions) {
    const {
      page = 1,
      limit = 10,
      isPublished,
      categoryId,
      subcategoryId,
      instructorId,
      search,
      language,
      minPrice,
      maxPrice,
    } = options;

    const query: any = {};

    // Add filters
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }

    if (instructorId) {
      query['instructor.name'] = instructorId;
    }

    if (language) {
      query.languages = language;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }ს
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.ru': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ru': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments(query),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findByCategory(categoryId: string, options: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find({ categoryId, isPublished: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments({ categoryId, isPublished: true }),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByInstructor(instructorId: string, options: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.courseModel
        .find({ 'instructor.name': instructorId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments({ 'instructor.name': instructorId }),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
      
    if (!updatedCourse) {
      throw new NotFoundException('Course not found');
    }
    
    return updatedCourse;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException('Course not found');
    }
  }



  async findUserCourses(userId: string): Promise<Course[]> {
    return this.courseModel
      .find({ enrolledUsers: userId as any })
      .populate('category')
      .exec();
  }

  // კურსის სტატისტიკის მეთოდები



}