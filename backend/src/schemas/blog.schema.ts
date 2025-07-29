import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema()
export class LocalizedString {
  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  ru: string;
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: LocalizedString, required: true })
  title: LocalizedString;

  @Prop({ type: LocalizedString, required: true })
  description: LocalizedString;

  @Prop({ type: LocalizedString, required: true })
  excerpt: LocalizedString;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: Date.now })
  publishDate: Date;

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Article' }] })
  articles: Types.ObjectId[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog); 