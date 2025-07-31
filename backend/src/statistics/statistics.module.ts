import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Set, SetSchema } from '../schemas/set.schema';
import { Exercise, ExerciseSchema } from '../schemas/exercise.schema';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Set.name, schema: SetSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {} 