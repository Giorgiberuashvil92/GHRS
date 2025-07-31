import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SetController } from './set.controller';
import { SetService } from './set.service';
import { Set, SetSchema } from '../schemas/set.schema';
import { Category, CategorySchema } from '../schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Set.name, schema: SetSchema },
      { name: Category.name, schema: CategorySchema }
    ]),
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new Error('მხოლოდ სურათის ფაილებია დაშვებული'), false);
        }
      },
    }),
  ],
  controllers: [SetController],
  providers: [SetService],
  exports: [SetService]
})
export class SetModule {} 