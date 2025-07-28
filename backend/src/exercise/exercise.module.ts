import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise, ExerciseSchema } from '../schemas/exercise.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema }
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new Error('მხოლოდ ვიდეო და სურათის ფაილებია დაშვებული'), false);
        }
      },
    }),
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService]
})
export class ExerciseModule {} 