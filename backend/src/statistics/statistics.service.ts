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
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes + seconds / 60;
  }

  async getGlobalStatistics() {
    // Get total sets (complexes)
    const totalSets = await this.setModel.countDocuments({ isActive: true });

    // Get total exercises
    const totalExercises = await this.exerciseModel.countDocuments({ isActive: true });

    // Calculate total hours from sets
    const sets = await this.setModel.find({ isActive: true }, 'duration');
    const totalMinutes = sets.reduce((acc, set) => {
      return acc + this.convertDurationToMinutes(set.duration);
    }, 0);
    
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

    // Get published sets and exercises
    const publishedSets = await this.setModel.countDocuments({ isActive: true, isPublished: true });
    const publishedExercises = await this.exerciseModel.countDocuments({ isActive: true, isPublished: true });

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