import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { SetModule } from './set/set.module';
import { ExerciseModule } from './exercise/exercise.module';

import { UploadModule } from './upload/upload.module';
import { ArticleModule } from './article/article.module';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CourseModule } from './course/course.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModuleModule } from './course-module/course-module.module';
import { ReviewModule } from './review/review.module';
import { StatisticsModule } from './statistics/statistics.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db',
    ),

    AuthModule,
    UserModule,
    CategoryModule,
    SetModule,
    ExerciseModule,
    UploadModule,
    ArticleModule,
    BlogModule,
    PaymentModule,
    PurchaseModule,
    CourseModule,
    InstructorModule,
    CourseModuleModule,
    ReviewModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
