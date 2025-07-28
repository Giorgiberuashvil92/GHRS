import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type QuestionDocument = Question & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

// კითხვის ტიპები
export type QuestionType = 'multiple_choice' | 'single_choice' | 'text' | 'code' | 'file_upload' | 'true_false';

// პასუხის ვარიანტი
@Schema({ _id: false })
export class AnswerOption {
  @Prop({ required: true })
  id: string;

  @Prop({
    type: {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  text: MultilingualContent;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop()
  explanation?: MultilingualContent;
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LessonExercise', required: true })
  exerciseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lesson', required: true })
  lessonId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  text: MultilingualContent;

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
    enum: ['multiple_choice', 'single_choice', 'text', 'code', 'file_upload', 'true_false'], 
    required: true 
  })
  type: QuestionType;

  @Prop({ type: [AnswerOption] })
  options?: AnswerOption[];

  @Prop({ type: [String] })
  correctAnswers?: string[]; // option id-ები ან text პასუხები

  @Prop({
    type: {
      ka: { type: String },
      en: { type: String },
      ru: { type: String },
    },
  })
  explanation?: MultilingualContent;

  @Prop({ default: 1 })
  points: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  imageUrl?: string;

  @Prop()
  codeLanguage?: string; // კოდის ტიპის კითხვებისთვის

  @Prop()
  codeTemplate?: string; // კოდის საწყისი template

  @Prop({ default: false })
  isRequired: boolean;

  @Prop({ default: 60 })
  timeLimit?: number; // წამებში
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// ინდექსები
QuestionSchema.index({ exerciseId: 1 });
QuestionSchema.index({ lessonId: 1 });
QuestionSchema.index({ type: 1 });
QuestionSchema.index({ order: 1 });
QuestionSchema.index({ isActive: 1 });

// Response interface for frontend
export interface QuestionResponse {
  id: string;
  exerciseId: string;
  lessonId: string;
  text: MultilingualContent;
  description?: MultilingualContent;
  type: QuestionType;
  options?: AnswerOption[];
  explanation?: MultilingualContent;
  points: number;
  order: number;
  isActive: boolean;
  imageUrl?: string;
  codeLanguage?: string;
  codeTemplate?: string;
  isRequired: boolean;
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
} 