import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InstructorDocument = Instructor & Document;

// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}

@Schema({ 
  timestamps: true,
  collection: 'instructors' 
})
export class Instructor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profession: string;

  @Prop({
    type: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  bio: MultilingualContent;

  @Prop({
    type: {
      en: { type: String },
      ru: { type: String },
    },
  })
  htmlContent?: MultilingualContent;



  @Prop({
    type: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      date: { type: String, required: true },
      url: { type: String },
    }],
  })
  certificates?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];

  @Prop({ required: true })
  profileImage: string;



  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  coursesCount: number;

  @Prop({ default: 0 })
  studentsCount: number;

  @Prop({ default: 0 })
  averageRating: number;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);

// Response interface for frontend
export interface InstructorResponse {
  id: string;
  name: string;
  email: string;
  profession: string;
  bio: {
    en: string;
    ru: string;
  };
  htmlContent?: {
    en: string;
    ru: string;
  };
  certificates?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  profileImage: string;
  isActive: boolean;
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
} 