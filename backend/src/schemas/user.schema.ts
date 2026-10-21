import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Achievement {
  @Prop({ required: true })
  id: string;

  @Prop({ 
    type: {
      en: String,
      ru: String,
      ka: String
    },
    required: true 
  })
  title: {
    en: string;
    ru: string;
    ka: string;
  };

  @Prop({ 
    type: {
      en: String,
      ru: String,
      ka: String
    },
    required: true 
  })
  description: {
    en: string;
    ru: string;
    ka: string;
  };

  @Prop()
  image?: string;

  @Prop()
  imageBg?: string;

  @Prop({ default: 0 })
  current: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: Date.now })
  unlockedAt?: Date;

  @Prop({ default: Date.now })
  completedAt?: Date;
}

@Schema()
export class UserStatistics {
  @Prop({ default: 0 })
  totalTimeSpent: number; // in minutes

  @Prop({ default: 0 })
  totalExercisesCompleted: number;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  recordStreak: number;

  @Prop({ default: 0 })
  totalSetsCompleted: number;

  @Prop({ default: 0 })
  totalCoursesCompleted: number;

  @Prop({ type: [String], default: [] })
  completedExerciseIds: string[];

  @Prop({ type: [String], default: [] })
  completedSetIds: string[];

  @Prop({ type: [String], default: [] })
  completedCourseIds: string[];

  @Prop({ type: [Date], default: [] })
  activityDates: Date[];
}

@Schema({ 
  collection: 'users' 
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Server-managed sessions persist until logout or credential reset.
  @Prop({ type: [String], default: [], select: false })
  sessionIds: string[];

  @Prop({ select: false })
  passwordResetTokenHash?: string;

  @Prop({ select: false })
  passwordResetExpiresAt?: Date;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  image?: string;

  @Prop({ type: [String], default: [] })
  diseases: string[];

  @Prop({ default: '' })
  additionalInfo: string;

  @Prop({ default: false })
  fullAccess: boolean;

  @Prop({ default: null })
  deletedAt?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [Achievement], default: [] })
  achievements: Achievement[];

  @Prop({ type: UserStatistics, default: () => ({}) })
  statistics: UserStatistics;
}

export const UserSchema = SchemaFactory.createForClass(User);

// DTO for frontend response
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  image?: string;
}
