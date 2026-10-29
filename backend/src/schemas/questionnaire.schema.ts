import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { SubmitQuestionnaireDto } from '../questionnaire/dto/submit-questionnaire.dto';
export type QuestionnaireDocument = HydratedDocument<Questionnaire>;
@Schema({ timestamps: true })
export class Questionnaire {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) accountName: string;
  @Prop({ required: true }) accountEmail: string;
  @Prop({ default: 1 }) version: number;
  @Prop({ type: MongooseSchema.Types.Mixed, required: true }) answers: SubmitQuestionnaireDto;
  @Prop({ type: { en: String, ru: String }, _id: false }) conditionLabel?: { en: string; ru: string };
  @Prop({ required: true, enum: ['catalog', 'review', 'professional'] }) outcome: string;
  @Prop({ type: [{ _id: false, href: String, title: { en: String, ru: String } }], default: [] }) links: { href: string; title: { en: string; ru: string } }[];
  @Prop({ default: 'new', enum: ['new', 'reviewed'] }) status: string;
  @Prop({ default: '' }) curatorNotes: string;
  @Prop() reviewedAt?: Date;
  @Prop() reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
QuestionnaireSchema.index({ createdAt: -1, _id: -1 });
QuestionnaireSchema.index({ userId: 1, createdAt: -1 });
