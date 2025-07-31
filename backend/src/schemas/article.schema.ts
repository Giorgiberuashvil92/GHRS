import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class LocalizedString {
  @Prop({ required: false, default: '' })
  ka: string;

  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  ru: string;
}

@Schema()
export class TableOfContentItem {
  @Prop({ type: LocalizedString, required: true })
  title: LocalizedString;

  @Prop({ required: true })
  anchor: string;
}

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ type: LocalizedString, required: true })
  title: LocalizedString;

  @Prop({ type: String, unique: true, sparse: true })
  slug: string;

  @Prop({ type: LocalizedString, required: true })
  excerpt: LocalizedString;

  @Prop({ type: LocalizedString, required: true })
  content: LocalizedString;

  @Prop({ type: Types.ObjectId, ref: 'Blog', required: true })
  blogId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required: true })
  categoryId: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  featuredImages: string[];

  @Prop({ type: Author, required: true })
  author: Author;

  @Prop({ required: true })
  readTime: string;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ type: [TableOfContentItem], default: [] })
  tableOfContents: TableOfContentItem[];

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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments: Types.ObjectId[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article); 