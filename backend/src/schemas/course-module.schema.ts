import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CourseModuleDocument = CourseModule & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

@Schema({ timestamps: true })
export class CourseModule {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  title: MultilingualContent;

  @Prop({
    type: {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  description: MultilingualContent;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true, default: 0 })
  duration: number; // წუთებში

  @Prop({ default: 0 })
  lessonsCount: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);

// ინდექსები
CourseModuleSchema.index({ courseId: 1 });
CourseModuleSchema.index({ order: 1 });
CourseModuleSchema.index({ isPublished: 1 });

// Response interface for frontend
export interface CourseModuleResponse {
  id: string;
  courseId: string;
  title: MultilingualContent;
  description: MultilingualContent;
  order: number;
  duration: number;
  lessonsCount: number;
  isPublished: boolean;
  lessons?: any[]; // populate-ის დროს
  createdAt: string;
  updatedAt: string;
} 