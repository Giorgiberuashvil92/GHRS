import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exercise, ExerciseDocument } from '../schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    console.log('--- [SERVICE] ---');
    console.log('createExerciseDto:', createExerciseDto);

    const exercise = new this.exerciseModel({
      ...createExerciseDto,
      setId: new Types.ObjectId(createExerciseDto.setId),
      categoryId: new Types.ObjectId(createExerciseDto.categoryId),
      subCategoryId: createExerciseDto.subCategoryId 
        ? new Types.ObjectId(createExerciseDto.subCategoryId) 
        : undefined
    });

    console.log('--- [SERVICE] To be saved:', exercise);

    const saved = await exercise.save();

    console.log('--- [SERVICE] Saved:', saved);

    return saved;
  }

  async findAll(query: { setId?: string; categoryId?: string; subCategoryId?: string } = {}): Promise<Exercise[]> {
    const filter: any = {};
    
    if (query.setId) {
      filter.setId = new Types.ObjectId(query.setId);
    }
    
    if (query.categoryId) {
      filter.categoryId = new Types.ObjectId(query.categoryId);
    }
    
    if (query.subCategoryId) {
      filter.subCategoryId = new Types.ObjectId(query.subCategoryId);
    }

    return this.exerciseModel
      .find(filter)
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel
      .findById(id)
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .exec();

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }

  async update(id: string, updateExerciseDto: Partial<CreateExerciseDto>): Promise<Exercise> {
    const updateData: any = { ...updateExerciseDto };
    
    if (updateExerciseDto.setId) {
      updateData.setId = new Types.ObjectId(updateExerciseDto.setId);
    }
    
    if (updateExerciseDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(updateExerciseDto.categoryId);
    }
    
    if (updateExerciseDto.subCategoryId) {
      updateData.subCategoryId = new Types.ObjectId(updateExerciseDto.subCategoryId);
    }

    const exercise = await this.exerciseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .exec();

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }

  async remove(id: string): Promise<void> {
    const result = await this.exerciseModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
  }

  async findBySet(setId: string): Promise<Exercise[]> {
    return this.exerciseModel
      .find({ setId: new Types.ObjectId(setId) })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByCategory(categoryId: string): Promise<Exercise[]> {
    return this.exerciseModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Exercise[]> {
    return this.exerciseModel
      .find({ difficulty, isActive: true, isPublished: true })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  // Popular exercises methods
  async findPopular(): Promise<Exercise[]> {
    return this.exerciseModel
      .find({ isPopular: true, isActive: true, isPublished: true })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async setPopular(id: string, isPopular: boolean): Promise<Exercise> {
    console.log('🔥 ExerciseService.setPopular called with:', { id, isPopular });
    
    const exercise = await this.exerciseModel
      .findByIdAndUpdate(id, { isPopular }, { new: true })
      .populate('set', 'name description')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .exec();

    console.log('🔥 ExerciseService.setPopular result:', exercise);

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }

  async bulkSetPopular(exerciseIds: string[], isPopular: boolean): Promise<{ modifiedCount: number }> {
    const objectIds = exerciseIds.map(id => new Types.ObjectId(id));
    const result = await this.exerciseModel
      .updateMany(
        { _id: { $in: objectIds } },
        { isPopular }
      )
      .exec();

    return { modifiedCount: result.modifiedCount };
  }
} 