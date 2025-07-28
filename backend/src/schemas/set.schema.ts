import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SetDocument = Set & Document;

interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
}

interface Level {
  exerciseCount: number;
  isLocked: boolean;
}

interface Price {
  monthly: number;
  threeMonths: number;
  sixMonths: number;
  yearly: number;
}

interface Levels {
  beginner: Level;
  intermediate: Level;
  advanced: Level;
}

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Set {
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
      en: { type: String, required: true },
      ru: { type: String, required: true }
    },
    required: true
  })
  description: LocalizedString;

  @Prop({
    type: {
      en: { type: String, required: true },
      ru: { type: String, required: true }
    },
    required: true
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

  @Prop({ required: false })
  demoVideoUrl: string;

  @Prop({ required: false })
  duration: string;

  @Prop({ 
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: false
  })
  difficulty: string;

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

  @Prop({ required: true })
  thumbnailImage: string;

  @Prop({ type: Number, default: 0 })
  totalExercises: number;

  @Prop({ type: String, default: "00:00" })
  totalDuration: string;

  @Prop({ type: Number, default: 3 })
  difficultyLevels: number;

  @Prop({
    type: {
      beginner: {
        exerciseCount: { type: Number, default: 0 },
        isLocked: { type: Boolean, default: false }
      },
      intermediate: {
        exerciseCount: { type: Number, default: 0 },
        isLocked: { type: Boolean, default: true }
      },
      advanced: {
        exerciseCount: { type: Number, default: 0 },
        isLocked: { type: Boolean, default: true }
      }
    },
    required: true,
    _id: false
  })
  levels: Levels;

  @Prop({
    type: {
      monthly: { type: Number, required: true },
      threeMonths: { type: Number, required: true },
      sixMonths: { type: Number, required: true },
      yearly: { type: Number, required: true }
    },
    required: true,
    _id: false
  })
  price: Price;

  @Prop({
    type: {
      monthly: { type: Number, required: false },
      threeMonths: { type: Number, required: false },
      sixMonths: { type: Number, required: false },
      yearly: { type: Number, required: false }
    },
    required: false,
    _id: false
  })
  discountedPrice: Price;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  subCategoryId?: Types.ObjectId;
}

export const SetSchema = SchemaFactory.createForClass(Set);

// ვირტუალური ველები
SetSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

SetSchema.virtual('subcategory', {
  ref: 'Category',
  localField: 'subCategoryId',
  foreignField: '_id',
  justOne: true
});

// ინდექსები
SetSchema.index({ categoryId: 1 });
SetSchema.index({ subCategoryId: 1 });
SetSchema.index({ isActive: 1 });
SetSchema.index({ isPublished: 1 });
SetSchema.index({ sortOrder: 1 });
SetSchema.index({ 'price.monthly': 1 });
SetSchema.index({ 'levels.beginner.isLocked': 1 }); 