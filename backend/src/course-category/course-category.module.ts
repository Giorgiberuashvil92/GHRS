import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CourseCategory, CourseCategorySchema } from '../schemas/course-category.schema';
import { CourseCategoryController } from './course-category.controller';
import { CourseCategoryService } from './course-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseCategory.name, schema: CourseCategorySchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new Error('Only image files are allowed'), false);
        }
      },
    }),
  ],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
  exports: [CourseCategoryService],
})
export class CourseCategoryModule {}
