import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConsultationRequestDocument = ConsultationRequest & Document;

@Schema({ timestamps: true })
export class ConsultationRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ enum: ['pending', 'contacted', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ enum: ['en', 'ru', 'ka', 'he', 'ar', 'de', 'fr', 'it', 'uk'], required: true })
  locale: string;

  @Prop()
  notes: string;

  @Prop()
  contactedAt: Date;

  @Prop()
  contactedBy: string;

  @Prop({ default: false })
  emailSent: boolean;
}

export const ConsultationRequestSchema = SchemaFactory.createForClass(ConsultationRequest);
