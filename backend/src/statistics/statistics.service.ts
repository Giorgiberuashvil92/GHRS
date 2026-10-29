import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Set } from '../schemas/set.schema';
import { Exercise } from '../schemas/exercise.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Set.name) private setModel: Model<Set>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  private convertDurationToMinutes(duration: string): number {
    if (!duration) return 0;
    // Handle formats: "HH:MM:SS" or "MM:SS"
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      // HH:MM:SS format
      const [hours, minutes, seconds] = parts;
      return hours * 60 + minutes + seconds / 60;
    } else if (parts.length === 2) {
      // MM:SS format
      const [minutes, seconds] = parts;
      return minutes + seconds / 60;
    }
    return 0;
  }

  async getGlobalStatistics() {
    const [totalSets, totalExercises, sets, publishedSets, publishedExercises] = await Promise.all([
      this.setModel.countDocuments({ isActive: true }),
      this.exerciseModel.countDocuments({ isActive: true }),
      this.setModel.find({ isActive: true }, 'totalDuration').lean(),
      this.setModel.countDocuments({ isActive: true, isPublished: true }),
      this.exerciseModel.countDocuments({ isActive: true, isPublished: true }),
    ]);
    const totalMinutes = sets.reduce((acc, set) => acc + this.convertDurationToMinutes(set.totalDuration), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    return {
      total: {
        sets: totalSets,
        exercises: totalExercises,
        hours: totalHours
      },
      published: {
        sets: publishedSets,
        exercises: publishedExercises
      }
    };
  }
} 