import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article, ArticleSchema } from '../schemas/article.schema';
import { Blog, BlogSchema } from '../schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Blog.name, schema: BlogSchema },
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
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 10, // Maximum 10 files
      },
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {} 