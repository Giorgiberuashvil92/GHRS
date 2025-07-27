import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { CourseReview, CourseReviewSchema } from '../schemas/course-review.schema';
import { CourseRating, CourseRatingSchema } from '../schemas/course-rating.schema';
import { Course, CourseSchema } from '../schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseReview.name, schema: CourseReviewSchema },
      { name: CourseRating.name, schema: CourseRatingSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {} 