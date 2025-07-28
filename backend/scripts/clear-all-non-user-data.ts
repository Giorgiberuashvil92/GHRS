import { MongooseModule } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Category, CategorySchema } from '../src/schemas/category.schema';
import { Set, SetSchema } from '../src/schemas/set.schema';
import { Exercise, ExerciseSchema } from '../src/schemas/exercise.schema';
import * as mongoose from 'mongoose';

async function clearAllNonUserData() {
  await NestFactory.createApplicationContext(AppModule); // Initialize NestJS context to load config and modules

  const dbUri = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';

  try {
    await mongoose.connect(dbUri);

    const models = [
      { name: Category.name, schema: CategorySchema, collectionName: 'categories' },
      { name: Set.name, schema: SetSchema, collectionName: 'sets' },
      { name: Exercise.name, schema: ExerciseSchema, collectionName: 'exercises' },
    ];

    for (const modelInfo of models) {
      const Model = mongoose.model(modelInfo.name, modelInfo.schema);

      // Delete all documents
      await Model.deleteMany({});

      // Drop all indexes
      try {
        await Model.collection.dropIndexes();
      } catch (error: any) {
        if (error.codeName === 'IndexNotFound') {
        } else {
          console.error(`Error dropping indexes for ${modelInfo.collectionName}:`, error);
        }
      }
    }

  } catch (error) {
    console.error('Error during database operation:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearAllNonUserData(); 