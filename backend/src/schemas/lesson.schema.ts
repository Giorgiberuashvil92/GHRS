import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LessonDocument = Lesson & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseModule', required: true })
  moduleId: MongooseSchema.Types.ObjectId;

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

  @Prop({
    type: {
      ka: { type: String },
      en: { type: String },
      ru: { type: String },
    },
  })
  content?: MultilingualContent; // HTML კონტენტი

  @Prop()
  videoUrl?: string;

  @Prop()
  videoDuration?: number; // წამებში

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 0 })
  duration: number; // წუთებში

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFree: boolean; // Preview ლექციებისთვის

  @Prop({ default: 0 })
  materialsCount: number;

  @Prop({ default: 0 })
  exercisesCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  completedBy: MongooseSchema.Types.ObjectId[];

  @Prop({ default: 0 })
  completionCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  averageTimeSpent: number; // წუთებში

  @Prop({
    type: [{
      userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      completedAt: { type: Date },
      timeSpent: { type: Number }, // წუთებში
      progress: { type: Number, default: 0 }, // პროცენტებში
    }],
  })
  userProgress?: {
    userId: MongooseSchema.Types.ObjectId;
    completedAt: Date;
    timeSpent: number;
    progress: number;
  }[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

// ინდექსები
LessonSchema.index({ moduleId: 1 });
LessonSchema.index({ courseId: 1 });
LessonSchema.index({ order: 1 });
LessonSchema.index({ isPublished: 1 });
LessonSchema.index({ isFree: 1 });

// Response interface for frontend
export interface LessonResponse {
  id: string;
  moduleId: string;
  courseId: string;
  title: MultilingualContent;
  description: MultilingualContent;
  content?: MultilingualContent;
  videoUrl?: string;
  videoDuration?: number;
  order: number;
  duration: number;
  isPublished: boolean;
  isFree: boolean;
  materialsCount: number;
  exercisesCount: number;
  completionCount: number;
  viewCount: number;
  averageTimeSpent: number;
  materials?: any[]; // populate-ის დროს
  exercises?: any[]; // populate-ის დროს
  userProgress?: any; // მომხმარებლის პროგრესი
  createdAt: string;
  updatedAt: string;
} 