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
import { EmailModule } from './email/email.module'; // ← დამატებული
import { LegalModule } from './legal/legal.module';
import { ConsultationModule } from './consultation/consultation.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/grs-db'),
    EmailModule, 
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
    LegalModule,
    ConsultationModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}