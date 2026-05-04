import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({
    type: {
      en: { type: String, required: true },
      ru: { type: String },
    },
    required: true,
  })
  title: {
    en: string;
    ru?: string;
  };

  @Prop({
    type: {
      en: { type: String, required: true },
      ru: { type: String },
    },
    required: true,
  })
  description: {
    en: string;
    ru?: string;
  };

  @Prop({
    type: {
      en: { type: String },
      ru: { type: String },
    },
  })
  shortDescription?: {
    en: string;
    ru?: string;
  };

  @Prop({
    type: [{
      title: {
        en: { type: String, required: true },
        ru: { type: String },
      },
      content: {
        en: { type: String, required: true },
        ru: { type: String },
      },
      isActive: { type: Boolean, required: true },
    }],
    default: [],
  })
  announcements: Array<{
    title: {
      en: string;
      ru?: string;
    };
    content: {
      en: string;
      ru?: string;
    };
    isActive: boolean;
  }>;

  @Prop({ required: true })
  price: number;

  /** ფასი ენის მიხედვით (ენ → ციფრი). თუ არ არის, იყენება price */
  @Prop({
    type: {
      en: { type: Number },
      ru: { type: Number },
      ka: { type: Number },
    },
  })
  priceLocalized?: { en?: number; ru?: number; ka?: number };

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: [String], default: [] })
  additionalImages: string[];

  @Prop()
  advertisementImage?: string;

  @Prop()
  previewVideoUrl?: string;

  @Prop()
  duration?: number;

  @Prop({ required: true, default: false })
  isPublished: boolean;

  @Prop({
    type: {
      name: { type: String, required: true },
      instructorId: { type: String, required: false },
    },
    required: true,
  })
  instructor: {
    name: string;
    instructorId?: string;
  };

  @Prop({
    type: {
      en: { type: String },
      ru: { type: String },
    },
  })
  prerequisites?: {
    en: string;
    ru: string;
  };

  @Prop({
    type: {
      en: { type: String },
      ru: { type: String },
    },
  })
  certificateDescription?: {
    en: string;
    ru: string;
  };

  @Prop({ type: [String], default: [] })
  certificateImages: string[];

  @Prop({
    type: [{
      en: { type: String, required: true },
      ru: { type: String, required: true },
    }],
    default: [],
  })
  learningOutcomes: Array<{
    en: string;
    ru: string;
  }>;

  @Prop({
    type: [{
      title: {
        en: { type: String, required: true },
        ru: { type: String },
      },
      description: {
        en: { type: String, default: '' },
        ru: { type: String, default: '' },
      },
      duration: { type: Number },
    }],
    default: [],
  })
  syllabus: Array<{
    title: {
      en: string;
      ru?: string;
    };
    description: {
      en: string;
      ru?: string;
    };
    duration?: number;
  }>;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  /** ერთი კატეგორია (ძველი ველი, უკან თავსებადობისთვის) */
  @Prop()
  categoryId?: string;

  @Prop()
  subcategoryId?: string;

  /** რამდენიმე კატეგორია — კურსის კატეგორიების ID-ების მასივი */
  @Prop({ type: [String], default: [] })
  categoryIds: string[];

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course); 