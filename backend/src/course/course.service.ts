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
      const categoryIds = createCourseDto.categoryIds?.length
        ? createCourseDto.categoryIds
        : createCourseDto.categoryId
          ? [createCourseDto.categoryId, createCourseDto.subcategoryId].filter(Boolean) as string[]
          : [];

      if (categoryIds.length === 0) {
        throw new BadRequestException('At least one category is required');
      }

      const CourseCategoryModel = this.courseModel.db.model('CourseCategory');
      for (const id of categoryIds) {
        const exists = await CourseCategoryModel.findById(id);
        if (!exists) {
          throw new NotFoundException(`Category not found: ${id}`);
        }
      }

      // Create course with default values - ყველა ველი ყოველთვის იგზავნება
      const courseData = {
        ...createCourseDto,
        categoryIds,
        categoryId: categoryIds[0],
        subcategoryId: categoryIds.length > 1 ? categoryIds[1] : undefined,
        // მასივები - ყოველთვის იგზავნება (ცარიელი მასივიც კი)
        certificateImages: createCourseDto.certificateImages || [],
        announcements: createCourseDto.announcements || [],
        additionalImages: createCourseDto.additionalImages || [],
        learningOutcomes: createCourseDto.learningOutcomes || [],
        syllabus: (createCourseDto.syllabus || []).map(item => ({
          ...item,
          duration: item.duration || 0 // duration ყოველთვის იგზავნება
        })),
        tags: createCourseDto.tags || [],
        
        // მულტილინგვალური ველები - ყოველთვის ორივე ენაზე
        shortDescription: createCourseDto.shortDescription ? {
          en: createCourseDto.shortDescription.en || '',
          ru: createCourseDto.shortDescription.ru || createCourseDto.shortDescription.en || ''
        } : { en: '', ru: '' },
        
        prerequisites: createCourseDto.prerequisites ? {
          en: createCourseDto.prerequisites.en || '',
          ru: createCourseDto.prerequisites.ru || createCourseDto.prerequisites.en || ''
        } : { en: '', ru: '' },
        
        certificateDescription: createCourseDto.certificateDescription ? {
          en: createCourseDto.certificateDescription.en || '',
          ru: createCourseDto.certificateDescription.ru || createCourseDto.certificateDescription.en || ''
        } : { en: '', ru: '' },
        
        // description-იც ყოველთვის ორივე ენაზე
        description: {
          en: createCourseDto.description.en || '',
          ru: createCourseDto.description.ru || createCourseDto.description.en || ''
        },
        
        // title-იც ყოველთვის ორივე ენაზე
        title: {
          en: createCourseDto.title.en || '',
          ru: createCourseDto.title.ru || createCourseDto.title.en || ''
        },
        
        // თარიღები
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
      query.$or = [{ categoryIds: categoryId }, { categoryId }];
    }
    if (subcategoryId) {
      query.$or = [{ categoryIds: subcategoryId }, { subcategoryId }];
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
      }
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
    // არასწორი ObjectId (მაგ. 3223776058) იწვევს CastError-ს და 500-ს — ვაბრუნებთ 404-ს
    const is24Hex = /^[a-fA-F0-9]{24}$/.test(id);
    if (!is24Hex) {
      throw new NotFoundException('Course not found');
    }
    try {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (err: any) {
      if (err.name === 'NotFoundException') throw err;
      throw new NotFoundException('Course not found');
    }
  }

  async findByCategory(categoryId: string, options: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const catQuery = { $or: [{ categoryIds: categoryId }, { categoryId }], isPublished: true };

    const [courses, total] = await Promise.all([
      this.courseModel.find(catQuery).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.courseModel.countDocuments(catQuery),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCoursesByCategory(categoryId: string, options: {
    page: number;
    limit: number;
    search?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    excludeId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      language,
      minPrice,
      maxPrice,
      excludeId,
    } = options;

    const query: any = { $or: [{ categoryIds: categoryId }, { categoryId }] };

    // Exclude specific course (useful for "related courses")
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // Language filter
    if (language) {
      query.languages = language;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.ru': { $regex: search, $options: 'i' } },
        { 'title.ka': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ru': { $regex: search, $options: 'i' } },
        { 'description.ka': { $regex: search, $options: 'i' } },
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
      categoryId,
      filters: {
        search,
        language,
        minPrice,
        maxPrice,
        excludeId,
      },
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
    try {
      const CourseCategoryModel = this.courseModel.db.model('CourseCategory');
      const categoryIds = updateCourseDto.categoryIds?.length
        ? updateCourseDto.categoryIds
        : updateCourseDto.categoryId
          ? [updateCourseDto.categoryId, updateCourseDto.subcategoryId].filter(Boolean) as string[]
          : undefined;

      if (categoryIds?.length) {
        for (const id of categoryIds) {
          const exists = await CourseCategoryModel.findById(id);
          if (!exists) throw new NotFoundException(`Category not found: ${id}`);
        }
        updateCourseDto.categoryIds = categoryIds;
        updateCourseDto.categoryId = categoryIds[0];
        updateCourseDto.subcategoryId = categoryIds.length > 1 ? categoryIds[1] : undefined;
      }

      const updateData: any = { ...updateCourseDto };
      
      // თარიღების კონვერტაცია
      if (updateCourseDto.startDate) {
        updateData.startDate = new Date(updateCourseDto.startDate);
      }
      if (updateCourseDto.endDate) {
        updateData.endDate = new Date(updateCourseDto.endDate);
      }

      // მულტილინგვალური ველების დამუშავება
      if (updateCourseDto.title) {
        updateData.title = {
          en: updateCourseDto.title.en || '',
          ru: updateCourseDto.title.ru || updateCourseDto.title.en || ''
        };
      }

      if (updateCourseDto.description) {
        updateData.description = {
          en: updateCourseDto.description.en || '',
          ru: updateCourseDto.description.ru || updateCourseDto.description.en || ''
        };
      }

      if (updateCourseDto.shortDescription) {
        updateData.shortDescription = {
          en: updateCourseDto.shortDescription.en || '',
          ru: updateCourseDto.shortDescription.ru || updateCourseDto.shortDescription.en || ''
        };
      }

      if (updateCourseDto.prerequisites) {
        updateData.prerequisites = {
          en: updateCourseDto.prerequisites.en || '',
          ru: updateCourseDto.prerequisites.ru || updateCourseDto.prerequisites.en || ''
        };
      }

      if (updateCourseDto.certificateDescription) {
        updateData.certificateDescription = {
          en: updateCourseDto.certificateDescription.en || '',
          ru: updateCourseDto.certificateDescription.ru || updateCourseDto.certificateDescription.en || ''
        };
      }

      // syllabus-ის დამუშავება duration-ით
      if (updateCourseDto.syllabus) {
        updateData.syllabus = updateCourseDto.syllabus.map(item => ({
          ...item,
          duration: item.duration || 0
        }));
      }

      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .exec();
        
      if (!updatedCourse) {
        throw new NotFoundException('Course not found');
      }
      
      return updatedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update course: ' + error.message);
    }
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