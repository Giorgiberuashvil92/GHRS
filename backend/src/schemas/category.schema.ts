import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

interface LocalizedString {
  en: string;
  ru: string;
}

@Schema({ timestamps: true })
export class Category {
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
      en: String,
      ru: String
    }
  })
  description?: LocalizedString;

  @Prop()
  image?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  subcategories?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parentId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Set' }] })
  sets?: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// ინდექსები ოპტიმიზაციისთვის
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ isPublished: 1 }); 