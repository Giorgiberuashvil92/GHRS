import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseModule, CourseModuleDocument } from '../schemas/course-module.schema';
import { Course, CourseDocument } from '../schemas/course.schema';
import { Lesson, LessonDocument } from '../schemas/lesson.schema';
import { CreateCourseModuleDto, UpdateCourseModuleDto } from './dto/create-course-module.dto';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectModel(CourseModule.name) private courseModuleModel: Model<CourseModuleDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async create(createCourseModuleDto: CreateCourseModuleDto): Promise<CourseModule> {
    // შევამოწმოთ არსებობს-თუ კურსი
    const course = await this.courseModel.findById(createCourseModuleDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // შევამოწმოთ order-ის უნიკალურობა კურსში
    const existingModule = await this.courseModuleModel.findOne({
      courseId: createCourseModuleDto.courseId,
      order: createCourseModuleDto.order,
    });

    if (existingModule) {
      throw new ConflictException('Module with this order already exists in the course');
    }

    const createdModule = new this.courseModuleModel(createCourseModuleDto);
    return createdModule.save();
  }

  async findByCourse(
    courseId: string,
    includeUnpublished = false,
  ): Promise<CourseModule[]> {
    const query: any = { courseId };
    
    if (!includeUnpublished) {
      query.isPublished = true;
    }

    return this.courseModuleModel
      .find(query)
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string, populateLessons = false): Promise<CourseModule> {
    const module = await this.courseModuleModel.findById(id).exec();
    
    if (!module) {
      throw new NotFoundException('Course module not found');
    }
    
    if (populateLessons) {
      const lessons = await this.lessonModel
        .find({ moduleId: id })
        .sort({ order: 1 })
        .exec();
      
      // Add lessons to the module object
      (module as any).lessons = lessons;
    }
    
    return module;
  }

  async update(id: string, updateCourseModuleDto: UpdateCourseModuleDto): Promise<CourseModule> {
    // თუ order იცვლება, შევამოწმოთ უნიკალურობა
    if (updateCourseModuleDto.order !== undefined) {
      const module = await this.courseModuleModel.findById(id);
      if (!module) {
        throw new NotFoundException('Course module not found');
      }

      const existingModule = await this.courseModuleModel.findOne({
        courseId: module.courseId,
        order: updateCourseModuleDto.order,
        _id: { $ne: id },
      });

      if (existingModule) {
        throw new ConflictException('Module with this order already exists in the course');
      }
    }

    const updatedModule = await this.courseModuleModel
      .findByIdAndUpdate(id, updateCourseModuleDto, { new: true })
      .exec();
      
    if (!updatedModule) {
      throw new NotFoundException('Course module not found');
    }
    
    return updatedModule;
  }

  async remove(id: string): Promise<void> {
    const module = await this.courseModuleModel.findById(id);
    
    if (!module) {
      throw new NotFoundException('Course module not found');
    }

    // შევამოწმოთ აქვს-თუ ლექციები ამ მოდულს
    const lessonsCount = await this.lessonModel.countDocuments({ moduleId: id });

    if (lessonsCount > 0) {
      throw new ConflictException('Cannot delete module with existing lessons');
    }

    await this.courseModuleModel.deleteOne({ _id: id }).exec();
  }

  async updateLessonsCount(moduleId: string): Promise<void> {
    const lessonsCount = await this.lessonModel.countDocuments({ 
      moduleId,
      isPublished: true 
    });

    await this.courseModuleModel.findByIdAndUpdate(moduleId, {
      lessonsCount,
    });
  }

  async updateDuration(moduleId: string): Promise<void> {
    const lessons = await this.lessonModel.find({ 
      moduleId,
      isPublished: true 
    });

    const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

    await this.courseModuleModel.findByIdAndUpdate(moduleId, {
      duration: totalDuration,
    });
  }

  async reorderModules(courseId: string, moduleOrders: { id: string; order: number }[]): Promise<void> {
    // ვალიდაცია: ყველა მოდული უნდა იყოს ამ კურსში
    const moduleIds = moduleOrders.map(item => item.id);
    const modules = await this.courseModuleModel.find({
      _id: { $in: moduleIds },
      courseId,
    });

    if (modules.length !== moduleOrders.length) {
      throw new NotFoundException('Some modules not found in this course');
    }

    // batch update
    const updatePromises = moduleOrders.map(item =>
      this.courseModuleModel.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);
  }

  async duplicate(id: string): Promise<CourseModule> {
    const originalModule = await this.courseModuleModel.findById(id);
    
    if (!originalModule) {
      throw new NotFoundException('Course module not found');
    }

    // ახალი order-ის გენერაცია
    const maxOrder = await this.courseModuleModel
      .findOne({ courseId: originalModule.courseId })
      .sort({ order: -1 })
      .select('order');

    const newOrder = maxOrder ? maxOrder.order + 1 : 1;

    const duplicatedModule = new this.courseModuleModel({
      ...originalModule.toObject(),
      _id: undefined,
      title: {
        ka: `${originalModule.title.ka} (კოპია)`,
        en: `${originalModule.title.en} (Copy)`,
        ru: `${originalModule.title.ru} (Копия)`,
      },
      order: newOrder,
      isPublished: false,
      lessonsCount: 0,
      duration: 0,
    });

    return duplicatedModule.save();
  }


} 