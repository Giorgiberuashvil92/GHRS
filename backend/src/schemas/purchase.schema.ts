import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PurchaseDocument = Purchase & Document;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'sets', required: false })
  setId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: false })
  courseId?: Types.ObjectId;

  @Prop({ required: true, enum: ['set', 'course'], default: 'set' })
  itemType: string;

  @Prop({ required: true })
  paymentId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, default: 'paypal' })
  paymentMethod: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop()
  expiresAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase); 