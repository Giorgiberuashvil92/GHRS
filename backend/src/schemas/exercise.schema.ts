import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { permanentVideoUrl } from '../exercise/video-url';

export type ExerciseDocument = Exercise & Document;

interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
}

interface PriceObject {
  monthly: number;
  threeMonths: number;
  sixMonths: number;
  yearly: number;
}

interface LocalizedPriceObject {
  ka: PriceObject;
  en: PriceObject;
  ru: PriceObject;
}

interface LevelsObject {
  beginner: boolean;
  intermediate: boolean;
  advanced: boolean;
}

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
})
export class Exercise {
  @Prop({
    type: {
      en: { type: String, required: true },
      ru: { type: String, required: true }
    },
    required: true
  })
  name: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: false },
      ru: { type: String, required: false }
    },
    required: false
  })
  description: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: false },
      ru: { type: String, required: false }
    },
    required: false
  })
  recommendations: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: false },
      ru: { type: String, required: false }
    },
    required: false
  })
  additional: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: false },
      ru: { type: String, required: false }
    },
    required: false
  })
  equipment: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: false },
      ru: { type: String, required: false }
    },
    required: false
  })
  warnings: LocalizedString;

  @Prop({ required: false, get: permanentVideoUrl, set: permanentVideoUrl })
  videoUrl: string;

  @Prop({ required: false, get: permanentVideoUrl, set: permanentVideoUrl })
  videoUrlEn: string;

  @Prop({ required: false, get: permanentVideoUrl, set: permanentVideoUrl })
  demoVideoUrl: string;

  @Prop({ required: false })
  thumbnailUrl: string;

  @Prop({ required: false })
  thumbnailImage: string;

  @Prop({ required: true })
  videoDuration: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @Prop({ required: false, default: 0 })
  difficultyLevels: number;

  @Prop({ type: Object, required: false })
  levels: LevelsObject;

  @Prop({ type: Object, required: false })
  price: PriceObject;

  @Prop({ type: Object, required: false })
  priceKa: PriceObject;

  @Prop({ type: Object, required: false })
  priceEn: PriceObject;

  @Prop({ type: Object, required: false })
  discountedPrice: PriceObject;

  @Prop({ type: Object, required: false })
  discountedPriceKa: PriceObject;

  @Prop({ type: Object, required: false })
  discountedPriceEn: PriceObject;

  @Prop({ required: false, default: 0 })
  totalExercises: number;

  @Prop({ required: false, default: "00:00" })
  totalDuration: string;

  @Prop({ required: true })
  repetitions: string;

  @Prop({ required: true })
  sets: string;

  @Prop({ required: true })
  restTime: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: Types.ObjectId, ref: 'Set', required: true })
  setId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  subCategoryId?: Types.ObjectId;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

// ვირტუალური ველები
ExerciseSchema.virtual('set', {
  ref: 'Set',
  localField: 'setId',
  foreignField: '_id',
  justOne: true
});

ExerciseSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

ExerciseSchema.virtual('subcategory', {
  ref: 'Category',
  localField: 'subCategoryId',
  foreignField: '_id',
  justOne: true
});

// ინდექსები
ExerciseSchema.index({ setId: 1 });
ExerciseSchema.index({ categoryId: 1 });
ExerciseSchema.index({ subCategoryId: 1 });
ExerciseSchema.index({ isActive: 1 });
ExerciseSchema.index({ isPublished: 1 });
ExerciseSchema.index({ sortOrder: 1 });
ExerciseSchema.index({ difficulty: 1 });
