import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from '../schemas/instructor.schema';
import { Course, CourseDocument } from '../schemas/course.schema';
import { CreateInstructorDto, UpdateInstructorDto } from './dto/create-instructor.dto';
import { buildInstructorCourseMatch } from '../course/instructor-course-match.util';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /** გამოქვეყნებული კურსების რაოდენობა — იგივე მაჩვენებელი, რაც საჯარო სიაში (CourseService.findByInstructor). */
  private async countPublishedCoursesForInstructor(
    instructorId: string,
    displayName: string,
  ): Promise<number> {
    return this.courseModel.countDocuments({
      isPublished: true,
      $or: buildInstructorCourseMatch(instructorId, displayName),
    });
  }

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    // Debug logs
    console.log('\n🔍 Creating instructor with DTO:', JSON.stringify(createInstructorDto, null, 2));
    console.log('\n📋 Required fields check:');
    console.log('- name:', createInstructorDto.name);
    console.log('- email:', createInstructorDto.email);
    console.log('- profession:', createInstructorDto.profession);
    console.log('- bio:', createInstructorDto.bio);
    console.log('- profileImage:', createInstructorDto.profileImage);
    console.log('\n🌐 Multilingual content:');
    console.log('bio:', createInstructorDto.bio);
    console.log('htmlContent:', createInstructorDto.htmlContent);

    // შევამოწმოთ არ არსებობს-თუ email
    const existingInstructor = await this.instructorModel.findOne({ 
      email: createInstructorDto.email 
    });
    
    if (existingInstructor) {
      throw new ConflictException('Instructor with this email already exists');
    }

    const createdInstructor = new this.instructorModel(createInstructorDto);
    return createdInstructor.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    isActive?: boolean,
  ): Promise<{ instructors: Instructor[]; total: number }> {
    const query: any = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    


    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.instructorModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.instructorModel.countDocuments(query),
    ]);

    const instructors = await Promise.all(
      rows.map(async (doc) => {
        const id = String(doc._id);
        const coursesCount = await this.countPublishedCoursesForInstructor(id, doc.name);
        return { ...doc, id, coursesCount } as Instructor;
      }),
    );

    return { instructors, total };
  }

  async findOne(id: string): Promise<Instructor> {
    const doc = await this.instructorModel.findById(id).lean().exec();

    if (!doc) {
      throw new NotFoundException('Instructor not found');
    }

    const instId = String(doc._id);
    const coursesCount = await this.countPublishedCoursesForInstructor(instId, doc.name);

    return { ...doc, id: instId, coursesCount } as Instructor;
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
    // თუ email განახლდება, შევამოწმოთ უნიკალურობა
    if (updateInstructorDto.email) {
      const existingInstructor = await this.instructorModel.findOne({ 
        email: updateInstructorDto.email,
        _id: { $ne: id } // თავად ეს ინსტრუქტორი გამოვრიცხოთ
      });
      
      if (existingInstructor) {
        throw new ConflictException('Instructor with this email already exists');
      }
    }

    const updatedInstructor = await this.instructorModel
      .findByIdAndUpdate(id, updateInstructorDto, { new: true })
      .exec();
      
    if (!updatedInstructor) {
      throw new NotFoundException('Instructor not found');
    }
    
    return updatedInstructor;
  }

  async remove(id: string): Promise<void> {
    const instructor = await this.instructorModel.findById(id);
    
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // შევამოწმოთ აქვს-თუ კურსები ამ ინსტრუქტორს
    const coursesCount = await this.courseModel.countDocuments({
      'instructor.name': instructor.name
    });

    if (coursesCount > 0) {
      throw new ConflictException('Cannot delete instructor with existing courses');
    }

    await this.instructorModel.deleteOne({ _id: id }).exec();
  }

  async deactivate(id: string): Promise<Instructor> {
    const updatedInstructor = await this.instructorModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
      
    if (!updatedInstructor) {
      throw new NotFoundException('Instructor not found');
    }
    
    return updatedInstructor;
  }

  async activate(id: string): Promise<Instructor> {
    const updatedInstructor = await this.instructorModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .exec();
      
    if (!updatedInstructor) {
      throw new NotFoundException('Instructor not found');
    }
    
    return updatedInstructor;
  }

  // ინსტრუქტორის კურსები
  async getInstructorCourses(
    instructorId: string,
    page = 1,
    limit = 10,
    isPublished?: boolean,
  ): Promise<{ courses: Course[]; total: number }> {
    const instructor = await this.instructorModel.findById(instructorId);
    
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    const query: any = {
      'instructor.name': instructor.name
    };
    
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      this.courseModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('category')
        .sort({ createdAt: -1 })
        .exec(),
      this.courseModel.countDocuments(query),
    ]);

    return { courses, total };
  }

  // ინსტრუქტორის სტატისტიკა
  async getInstructorStats(instructorId: string): Promise<{
    coursesCount: number;
    studentsCount: number;
    averageRating: number;
    totalRatings: number;
    publishedCoursesCount: number;
    unpublishedCoursesCount: number;
    totalRevenue: number;
  }> {
    const instructor = await this.instructorModel.findById(instructorId);
    
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // ვიპოვოთ ინსტრუქტორის ყველა კურსი
    const courses = await this.courseModel.find({
      'instructor.name': instructor.name
    }).exec();

    const publishedCourses = courses.filter(course => course.isPublished);
    const unpublishedCourses = courses.filter(course => !course.isPublished);






    // შემოსავალი (მთლიანი ფასების ჯამი * მყიდველების რაოდენობა)
    

    // განახლდეს ინსტრუქტორის სტატისტიკა მონაცემთა ბაზაში
    
    return {
      coursesCount: courses.length,
      studentsCount: 0,
      averageRating: 0,
      totalRatings: 0,
      publishedCoursesCount: publishedCourses.length,
      unpublishedCoursesCount: unpublishedCourses.length,
      totalRevenue: 0,
    };
  }

  // ტოპ ინსტრუქტორები
  async getTopInstructors(limit = 10): Promise<Instructor[]> {
    const rows = await this.instructorModel
      .find({ isActive: true })
      .sort({ averageRating: -1, studentsCount: -1 })
      .limit(limit)
      .lean()
      .exec();

    return Promise.all(
      rows.map(async (doc) => {
        const id = String(doc._id);
        const coursesCount = await this.countPublishedCoursesForInstructor(id, doc.name);
        return { ...doc, id, coursesCount } as Instructor;
      }),
    );
  }


} 