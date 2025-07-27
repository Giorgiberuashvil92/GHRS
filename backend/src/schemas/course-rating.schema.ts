import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseRatingDocument = CourseRating & Document;

@Schema({ timestamps: true })
export class CourseRating {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, unique: true })
  courseId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  averageRating: number;

  @Prop({ required: true, default: 0 })
  totalReviews: number;

  @Prop({
    type: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    default: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  @Prop({ required: true, default: 0 })
  verifiedReviewsCount: number;
}

export const CourseRatingSchema = SchemaFactory.createForClass(CourseRating);

// Add indexes for better query performance
CourseRatingSchema.index({ courseId: 1 });
CourseRatingSchema.index({ averageRating: 1 }); 