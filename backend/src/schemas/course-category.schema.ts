import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseCategoryDocument = CourseCategory & Document;

interface LocalizedString {
  ka?: string;
  en: string;
  ru: string;
}

@Schema({ timestamps: true, collection: 'coursecategories' })
export class CourseCategory {
  @Prop({
    type: {
      ka: String,
      en: { type: String, required: true },
      ru: String,
    },
    required: true,
  })
  name: LocalizedString;

  @Prop({
    type: {
      ka: String,
      en: String,
      ru: String,
    },
  })
  description?: LocalizedString;

  @Prop()
  image?: string;

  @Prop({ type: Types.ObjectId, ref: 'CourseCategory' })
  parentId?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const CourseCategorySchema = SchemaFactory.createForClass(CourseCategory);

CourseCategorySchema.index({ parentId: 1 });
CourseCategorySchema.index({ isActive: 1 });
CourseCategorySchema.index({ sortOrder: 1 });
CourseCategorySchema.index({ isPublished: 1 });
