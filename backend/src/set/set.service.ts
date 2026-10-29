import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Set, SetDocument } from '../schemas/set.schema';
import { CreateSetDto } from './dto/create-set.dto';

@Injectable()
export class SetService {
  constructor(
    @InjectModel(Set.name) private setModel: Model<SetDocument>
  ) {}

  private transformPrice(price: any): any {
    if (typeof price === 'string') {
      try {
        return JSON.parse(price);
      } catch (e) {
        return price;
      }
    }
    return price;
  }

  async create(createSetDto: CreateSetDto): Promise<Set> {
    // დავამატოთ default მნიშვნელობები და გარდავქმნათ მონაცემები
    const setData = {
      ...createSetDto,
      // თუ demoVideoUrl სტრინგია, გადავაკეთოთ ობიექტად
      demoVideoUrl: typeof createSetDto.demoVideoUrl === 'string' 
        ? { en: createSetDto.demoVideoUrl, ru: createSetDto.demoVideoUrl }
        : createSetDto.demoVideoUrl,
      // ფასების ტრანსფორმაცია
      priceEn: this.transformPrice(createSetDto.priceEn),
      discountedPriceEn: this.transformPrice(createSetDto.discountedPriceEn),
      levels: {
        beginner: { exerciseCount: 0, isLocked: false, ...createSetDto.levels?.beginner },
        intermediate: { exerciseCount: 0, isLocked: true, ...createSetDto.levels?.intermediate },
        advanced: { exerciseCount: 0, isLocked: true, ...createSetDto.levels?.advanced }
      },
      isActive: createSetDto.isActive ?? true,
      isPublished: createSetDto.isPublished ?? false,
      sortOrder: createSetDto.sortOrder ?? 0,
      categoryId: new Types.ObjectId(createSetDto.categoryId),
      subCategoryId: createSetDto.subCategoryId ? new Types.ObjectId(createSetDto.subCategoryId) : undefined
    };

    const set = new this.setModel(setData);
    return set.save();
  }

  async update(id: string, updateSetDto: Partial<CreateSetDto>): Promise<Set> {
    const updateData: any = { ...updateSetDto };
    
    // ObjectId-ების კონვერტაცია
    if (updateData.categoryId) {
      updateData.categoryId = new Types.ObjectId(updateData.categoryId);
    }
    if (updateData.subCategoryId) {
      updateData.subCategoryId = new Types.ObjectId(updateData.subCategoryId);
    }

    // demoVideoUrl-ის ტრანსფორმაცია
    if (typeof updateData.demoVideoUrl === 'string') {
      updateData.demoVideoUrl = {
        en: updateData.demoVideoUrl,
        ru: updateData.demoVideoUrl
      };
    }

    // ფასების ტრანსფორმაცია
    if (updateData.priceEn) {
      updateData.priceEn = this.transformPrice(updateData.priceEn);
    }
    if (updateData.discountedPriceEn) {
      updateData.discountedPriceEn = this.transformPrice(updateData.discountedPriceEn);
    }

    const updatedSet = await this.setModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category')
      .populate('subcategory')
      .exec();

    if (!updatedSet) {
      throw new NotFoundException(`Set with ID "${id}" not found`);
    }

    return updatedSet;
  }

  async findAll(query: { categoryId?: string; subCategoryId?: string; view?: string }) {
    const filter: any = { isActive: true };
    
    if (query.categoryId) {
      filter.categoryId = new Types.ObjectId(query.categoryId);
    }
    
    if (query.subCategoryId) {
      filter.subCategoryId = new Types.ObjectId(query.subCategoryId);
    }

    if (query.view === 'summary') {
      const sets = await this.setModel.find(filter)
        .select('_id name description thumbnailImage totalExercises totalDuration duration difficultyLevels levels price priceKa priceEn discountedPrice discountedPriceKa discountedPriceEn isActive isPublished sortOrder categoryId subCategoryId updatedAt')
        .populate('category', '_id name').populate('subcategory', '_id name')
        .sort({ sortOrder: 1 }).lean().exec();
      return sets.map(set => ({ ...set,
        thumbnailImage: /^data:image\/[\w.+-]+;base64,/.test(set.thumbnailImage || '')
          ? `/api/sets/${set._id}/thumbnail?v=${new Date(set.updatedAt || 0).getTime()}`
          : set.thumbnailImage,
      }));
    }
    return this.setModel.find(filter).populate('category').populate('subcategory').sort({ sortOrder: 1 }).exec();
  }

  async getThumbnail(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid set ID');
    const set = await this.setModel.findById(id).select('thumbnailImage updatedAt').lean().exec();
    const match = set?.thumbnailImage?.match(/^data:(image\/[\w.+-]+);base64,([\s\S]+)$/);
    if (!match) throw new NotFoundException('Thumbnail not found');
    return { type: match[1], body: Buffer.from(match[2], 'base64'), version: new Date(set.updatedAt || 0).getTime() };
  }

  async findOne(id: string) {
    return this.setModel
      .findById(id)
      .populate('category')
      .populate('subcategory')
      .exec();
  }

  async remove(id: string): Promise<void> {
    // 1. იპოვე სეტი წაშლამდე, რომ მივიღოთ categoryId და subCategoryId
    const setToDelete = await this.setModel.findById(id).exec();
    
    if (!setToDelete) {
      throw new NotFoundException(`Set with ID ${id} not found`);
    }

    // 2. წაშალე სეტი
    await this.setModel.findByIdAndDelete(id).exec();

    // 3. წაშალე კატეგორიიდან sets array-იდან
    await this.setModel.db.model('Category').updateOne(
      { _id: setToDelete.categoryId },
      { $pull: { sets: new Types.ObjectId(id) } }
    ).exec();

    // 4. თუ არსებობს საბკატეგორია, წაშალე მისგანაც
    if (setToDelete.subCategoryId) {
      await this.setModel.db.model('Category').updateOne(
        { _id: setToDelete.subCategoryId },
        { $pull: { sets: new Types.ObjectId(id) } }
      ).exec();
    }

    console.log(`✅ Set ${id} deleted from category ${setToDelete.categoryId}${setToDelete.subCategoryId ? ` and subcategory ${setToDelete.subCategoryId}` : ''}`);
  }

  async duplicate(id: string): Promise<Set> {
    // აიღე არსებული სეტი
    const originalSet = await this.setModel.findById(id).exec();
    if (!originalSet) {
      throw new NotFoundException(`Set with ID "${id}" not found`);
    }

    // შექმენი დუპლიკატი - ვშლით MongoDB-ს სპეციფიურ ველებს
    const originalData = originalSet.toObject();
    
    // ვქმნით ახალ ობიექტს MongoDB-ს ველების გარეშე
    const cleanData = {
      name: originalData.name,
      description: originalData.description,
      recommendations: originalData.recommendations,
      additional: originalData.additional,
      demoVideoUrl: originalData.demoVideoUrl,
      duration: originalData.duration,
      difficulty: originalData.difficulty,
      equipment: originalData.equipment,
      warnings: originalData.warnings,
      thumbnailImage: originalData.thumbnailImage,
      totalExercises: originalData.totalExercises,
      totalDuration: originalData.totalDuration,
      difficultyLevels: originalData.difficultyLevels,
      levels: originalData.levels,
      price: originalData.price,
      priceEn: originalData.priceEn,
      discountedPrice: originalData.discountedPrice,
      discountedPriceEn: originalData.discountedPriceEn,
      isActive: originalData.isActive,
      sortOrder: originalData.sortOrder,
      categoryId: originalData.categoryId,
      subCategoryId: originalData.subCategoryId
    };
    
    const duplicatedSetData = {
      ...cleanData,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: {
        ka: cleanData.name.ka + ' (დუპლიკატი)',
        en: cleanData.name.en + ' (Copy)',
        ru: cleanData.name.ru + ' (Копия)'
      },
      isPublished: false
    };

    const duplicatedSet = new this.setModel(duplicatedSetData);
    return duplicatedSet.save();
  }

  /**
   * Recalculate and update totalDuration and totalExercises for a set
   * based on its exercises
   */
  async updateSetStatistics(setId: string): Promise<void> {
    try {
      // Get all exercises for this set
      const Exercise = this.setModel.db.model('Exercise');
      const exercises = await Exercise.find({ 
        setId: new Types.ObjectId(setId),
        isActive: true 
      }).exec();

      // Calculate total exercises
      const totalExercises = exercises.length;

      // Calculate total duration
      let totalMinutes = 0;
      let totalSeconds = 0;

      exercises.forEach((exercise: any) => {
        if (exercise.duration) {
          const [mins, secs] = exercise.duration.split(':').map(Number);
          if (!isNaN(mins) && !isNaN(secs)) {
            totalMinutes += mins;
            totalSeconds += secs;
          }
        }
      });

      // Convert excess seconds to minutes
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds = totalSeconds % 60;

      // Format as MM:SS or HH:MM:SS if over 60 minutes
      let totalDuration: string;
      if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        totalDuration = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
      } else {
        totalDuration = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
      }

      // Update the set
      await this.setModel.findByIdAndUpdate(
        setId,
        {
          totalExercises,
          totalDuration
        },
        { new: true }
      ).exec();

      console.log(`✅ Updated set ${setId} statistics: ${totalExercises} exercises, ${totalDuration} duration`);
    } catch (error) {
      console.error(`❌ Error updating set statistics for ${setId}:`, error);
    }
  }
} 