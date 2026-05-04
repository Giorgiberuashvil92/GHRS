import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/** ქვედოკუმენტზე Mongo ავტომატურ _id-ს არ ვამატებთ — API-ში სუფთა { en, ru, ka } */
const LocalizedNamePartsSchema = new MongooseSchema(
  {
    en: { type: String },
    ru: { type: String },
    ka: { type: String },
  },
  { _id: false },
);

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

  /** სახელი ენების მიხედვით (EN / RU / KA) */
  @Prop({ type: LocalizedNamePartsSchema })
  firstNameLocalized?: { en?: string; ru?: string; ka?: string };

  @Prop({ type: LocalizedNamePartsSchema })
  lastNameLocalized?: { en?: string; ru?: string; ka?: string };

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profession: string;

  @Prop()
  qualification?: string;

  @Prop()
  wikipedia?: string;

  @Prop({
    type: {
      ka: { type: String },
      en: { type: String },
      ru: { type: String },
    },
  })
  qualificationLocalized?: { en?: string; ru?: string; ka?: string };

  @Prop({
    type: {
      ka: { type: String },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    required: true,
  })
  bio: MultilingualContent;

  @Prop({
    type: {
      ka: { type: String },
      en: { type: String },
      ru: { type: String },
    },
  })
  htmlContent?: MultilingualContent;



  @Prop({
    type: [{
      name: { type: String },
      issuer: { type: String },
      date: { type: String },
      url: { type: String },
    }],
  })
  certificates?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];

  @Prop({
    type: [{
      url: { type: String },
    }],
  })
  diplomas?: {
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
  firstNameLocalized?: { en?: string; ru?: string; ka?: string };
  lastNameLocalized?: { en?: string; ru?: string; ka?: string };
  email: string;
  profession: string;
  qualification?: string;
  wikipedia?: string;
  qualificationLocalized?: { en?: string; ru?: string; ka?: string };
  professionLocalized?: { en?: string; ru?: string; ka?: string };
  bio: {
    ka?: string;
    en: string;
    ru: string;
  };
  htmlContent?: {
    ka?: string;
    en: string;
    ru: string;
  };
  certificates?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  diplomas?: {
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