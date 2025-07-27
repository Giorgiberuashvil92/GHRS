import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModuleService } from './course-module.service';
import { CourseModuleController } from './course-module.controller';
import { CourseModule as CourseModuleSchema, CourseModuleSchema as CourseModuleSchemaFactory } from '../schemas/course-module.schema';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Lesson, LessonSchema } from '../schemas/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseModuleSchema.name, schema: CourseModuleSchemaFactory },
      { name: Course.name, schema: CourseSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
  exports: [CourseModuleService],
})
export class CourseModuleModule {} 