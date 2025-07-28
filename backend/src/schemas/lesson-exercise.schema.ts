import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LessonExerciseDocument = LessonExercise & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

// სავარჯიშოს ტიპები
export type ExerciseType = 'quiz' | 'assignment' | 'practice' | 'survey' | 'coding';

@Schema({ timestamps: true })
export class LessonExercise {
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
  instructions?: MultilingualContent;

  @Prop({ 
    type: String, 
    enum: ['quiz', 'assignment', 'practice', 'survey', 'coding'], 
    required: true 
  })
  type: ExerciseType;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  timeLimit?: number; // წუთებში

  @Prop({ default: 60 })
  passingScore: number; // პროცენტებში

  @Prop({ default: 1 })
  maxAttempts: number; // მცდელობების რაოდენობა

  @Prop({ default: false })
  isRequired: boolean; // სავალდებულოა კურსის დასრულებისთვის

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: true })
  showCorrectAnswers: boolean; // ჩატარების შემდეგ პასუხების ჩვენება

  @Prop({ default: true })
  allowRetake: boolean; // თავიდან გავლის უფლება

  @Prop({ default: 0 })
  totalPoints: number; // ყველა კითხვის ქულების ჯამი

  @Prop({ default: 0 })
  questionsCount: number;

  @Prop()
  dueDate?: Date; // დედლაინი assignment-ებისთვის

  @Prop({
    type: [{
      userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      score: { type: Number },
      percentage: { type: Number },
      completedAt: { type: Date },
      attempts: { type: Number, default: 1 },
      timeSpent: { type: Number }, // წამებში
      answers: [{ type: MongooseSchema.Types.Mixed }],
    }],
  })
  submissions?: {
    userId: MongooseSchema.Types.ObjectId;
    score: number;
    percentage: number;
    completedAt: Date;
    attempts: number;
    timeSpent: number;
    answers: any[];
  }[];

  @Prop({ default: 0 })
  completionCount: number;

  @Prop({ default: 0 })
  averageScore: number;
}

export const LessonExerciseSchema = SchemaFactory.createForClass(LessonExercise);

// ინდექსები
LessonExerciseSchema.index({ lessonId: 1 });
LessonExerciseSchema.index({ moduleId: 1 });
LessonExerciseSchema.index({ courseId: 1 });
LessonExerciseSchema.index({ type: 1 });
LessonExerciseSchema.index({ order: 1 });
LessonExerciseSchema.index({ isPublished: 1 });
LessonExerciseSchema.index({ isRequired: 1 });
LessonExerciseSchema.index({ dueDate: 1 });

// Response interface for frontend
export interface LessonExerciseResponse {
  id: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  title: MultilingualContent;
  description: MultilingualContent;
  instructions?: MultilingualContent;
  type: ExerciseType;
  order: number;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  isRequired: boolean;
  isPublished: boolean;
  showCorrectAnswers: boolean;
  allowRetake: boolean;
  totalPoints: number;
  questionsCount: number;
  dueDate?: string;
  completionCount: number;
  averageScore: number;
  questions?: any[]; // populate-ის დროს
  userSubmission?: any; // მომხმარებლის უკანასკნელი გაგზავნა
  createdAt: string;
  updatedAt: string;
} 