import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseReviewDocument = CourseReview & Document;

@Schema({ timestamps: true })
export class CourseReview {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop()
  userAvatar?: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: [String] })
  pros?: string[];

  @Prop({ type: [String] })
  cons?: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: 0 })
  helpfulCount: number;
}

export const CourseReviewSchema = SchemaFactory.createForClass(CourseReview);

// Add indexes for better query performance
CourseReviewSchema.index({ courseId: 1 });
CourseReviewSchema.index({ userId: 1 });
CourseReviewSchema.index({ isApproved: 1 });
CourseReviewSchema.index({ rating: 1 }); 