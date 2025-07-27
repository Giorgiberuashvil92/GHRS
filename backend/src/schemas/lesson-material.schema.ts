import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LessonMaterialDocument = LessonMaterial & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

// მასალის ტიპები
export type MaterialType = 'pdf' | 'doc' | 'presentation' | 'link' | 'code' | 'video' | 'audio' | 'archive';

@Schema({ timestamps: true })
export class LessonMaterial {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lesson', required: true })
  lessonId: MongooseSchema.Types.ObjectId;

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
      ka: { type: String },
      en: { type: String },
      ru: { type: String },
    },
  })
  description?: MultilingualContent;

  @Prop({ 
    type: String, 
    enum: ['pdf', 'doc', 'presentation', 'link', 'code', 'video', 'audio', 'archive'], 
    required: true 
  })
  type: MaterialType;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  fileName?: string;

  @Prop()
  fileSize?: number; // bytes-ში

  @Prop()
  mimeType?: string;

  @Prop({ default: true })
  downloadable: boolean;

  @Prop({ default: false })
  isRequired: boolean; // სავალდებულო მასალაა ლექციის დასრულებისთვის

  @Prop({ default: 0 })
  order: number; // მასალების რიგითობა

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  downloadedBy: MongooseSchema.Types.ObjectId[];
}

export const LessonMaterialSchema = SchemaFactory.createForClass(LessonMaterial);

// ინდექსები
LessonMaterialSchema.index({ lessonId: 1 });
LessonMaterialSchema.index({ moduleId: 1 });
LessonMaterialSchema.index({ courseId: 1 });
LessonMaterialSchema.index({ type: 1 });
LessonMaterialSchema.index({ order: 1 });
LessonMaterialSchema.index({ isActive: 1 });

// Response interface for frontend
export interface LessonMaterialResponse {
  id: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  title: MultilingualContent;
  description?: MultilingualContent;
  type: MaterialType;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  downloadable: boolean;
  isRequired: boolean;
  order: number;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
} 