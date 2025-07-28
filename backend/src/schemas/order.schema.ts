import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

// პროდუქტის ტიპის enum
export enum ProductType {
  COURSE = 'course',
  SET = 'set'
}

// შეკვეთის სტატუსის enum
export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// შეკვეთის პროდუქტის ინტერფეისი
@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, required: true, refPath: 'items.productType' })
  productId: Types.ObjectId;

  @Prop({ required: true, enum: ProductType })
  productType: ProductType;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, default: 'RUB' })
  currency: string;

  @Prop({ 
    required: true, 
    enum: OrderStatus,
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @Prop()
  paymentId: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  failureReason: string;

  @Prop({ type: Object })
  paymentDetails: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 