import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
}

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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

  @Prop({ required: false })
  videoUrl: string;

  @Prop({ required: false })
  thumbnailUrl: string;

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