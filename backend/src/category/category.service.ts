import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Set, SetDocument } from '../schemas/set.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Set.name) private setModel: Model<SetDocument>,
  ) {}

  async create(createCategoryDto: any): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  } 

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find()
      .populate('subcategories', '_id name image description')
      .populate('sets', '_id name thumbnailImage totalExercises totalDuration price')
      .select('name description image subcategories sets isActive sortOrder isPublished parentId')
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id)
      .populate('subcategories', '_id name image description')
      .populate('sets', '_id name thumbnailImage totalExercises totalDuration price')
      .exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getCategorySets(id: string) {
    const category = await this.categoryModel.findById(id)
      .populate({
        path: 'sets',
        populate: {
          path: 'exercises'
        }
      })
      .exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category.sets;
  }

  async getCategoryComplete(id: string) {
    // კატეგორია
    const category = await this.categoryModel.findById(id)
      .populate('subcategories')
      .exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // სეტები ამ კატეგორიისთვის
    const sets = await this.categoryModel.db.model('Set').find({
      categoryId: new Types.ObjectId(id),
      isActive: true
    }).exec();

    // სავარჯიშოები ამ კატეგორიისთვის
    const exercises = await this.categoryModel.db.model('Exercise').find({
      categoryId: new Types.ObjectId(id),
      isActive: true
    }).exec();

    // სეტებისთვის სავარჯიშოების დამატება
    const setsWithExercises = await Promise.all(
      sets.map(async (set) => {
        const setExercises = await this.categoryModel.db.model('Exercise').find({
          setId: set._id,
          isActive: true
        }).exec();
        return {
          ...set.toObject(),
          exercises: setExercises
        };
      })
    );

    // საბ-კატეგორიები (parentId-ით მოძიება)
    const subcategories = await this.categoryModel.find({
      parentId: new Types.ObjectId(id),
      isActive: true
    }).exec();

    return {
      category,
      sets: setsWithExercises,
      subcategories,
      exercises
    };
  }

  async update(id: string, updateCategoryDto: any): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async addSubcategory(categoryId: string, subcategoryId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subcategory = await this.categoryModel.findById(subcategoryId);
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (!category.subcategories) {
      category.subcategories = [];
    }

    if (!category.subcategories.includes(new Types.ObjectId(subcategoryId))) {
      category.subcategories.push(new Types.ObjectId(subcategoryId));
      
      // საბკატეგორიაში მშობელი კატეგორიის დაყენება
      subcategory.parentId = new Types.ObjectId(categoryId);
      await subcategory.save();
      await category.save();
    }

    return category;
  }

  async removeSubcategory(categoryId: string, subcategoryId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.subcategories) {
      category.subcategories = category.subcategories.filter(
        id => id.toString() !== subcategoryId
      );
      await category.save();
    }

    // საბკატეგორიაში მშობელი კატეგორიის მოშორება
    const subcategory = await this.categoryModel.findById(subcategoryId);
    if (subcategory) {
      subcategory.parentId = undefined;
      await subcategory.save();
    }

    return category;
  }

  async getSubcategories(categoryId: string): Promise<Category[]> {
    const subcategories = await this.categoryModel.find({ parentId: new Types.ObjectId(categoryId), isActive: true })
      .populate('subcategories')
      .populate('sets')
      .exec();

    const counts = await this.setModel.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      {
        $match: {
          categoryId: new Types.ObjectId(categoryId),
          subCategoryId: { $in: subcategories.map((subcategory) => subcategory._id) },
          isActive: true,
        },
      },
      { $group: { _id: '$subCategoryId', count: { $sum: 1 } } },
    ]);
    const countsById = new Map(counts.map(({ _id, count }) => [_id.toString(), count]));

    return subcategories.map((subcategory) => ({
      ...subcategory.toObject(),
      setsCount: countsById.get(subcategory._id.toString()) ?? 0,
    }));
  }

  async getSubCategoryById(categoryId: string, subCategoryId: string): Promise<Category> {
    const subcategory = await this.categoryModel.findOne({ 
      _id: new Types.ObjectId(subCategoryId),
      parentId: new Types.ObjectId(categoryId),
      isActive: true 
    })
    .populate('subcategories')
    .populate('sets')
    .exec();
    
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async updateSubCategory(categoryId: string, subCategoryId: string, updateCategoryDto: any): Promise<Category> {
    const subcategory = await this.categoryModel.findOneAndUpdate(
      { 
        _id: new Types.ObjectId(subCategoryId),
        parentId: new Types.ObjectId(categoryId)
      },
      updateCategoryDto,
      { new: true }
    ).exec();
    
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async getSubCategorySets(categoryId: string, subCategoryId: string) {
    // საბკატეგორიის არსებობის შემოწმება
    const subcategory = await this.categoryModel.findOne({ 
      _id: new Types.ObjectId(subCategoryId),
      parentId: new Types.ObjectId(categoryId),
      isActive: true 
    }).exec();
    
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    // სეტები ამ საბკატეგორიისთვის
    const sets = await this.categoryModel.db.model('Set').find({
      subCategoryId: new Types.ObjectId(subCategoryId),
      isActive: true
    }).exec();

    // სეტებისთვის სავარჯიშოების დამატება
    const setsWithExercises = await Promise.all(
      sets.map(async (set) => {
        const setExercises = await this.categoryModel.db.model('Exercise').find({
          setId: set._id,
          isActive: true
        }).exec();
        return {
          ...set.toObject(),
          exercises: setExercises
        };
      })
    );

    return setsWithExercises;
  }

  async createSubcategory(parentId: string, createCategoryDto: any): Promise<Category> {
    const parentCategory = await this.categoryModel.findById(parentId);
    if (!parentCategory) {
      throw new NotFoundException('Parent category not found');
    }

    const subcategory = new this.categoryModel({
      ...createCategoryDto,
      parentId: new Types.ObjectId(parentId)
    });
    
    const savedSubcategory = await subcategory.save();

    // მშობელ კატეგორიაში საბკატეგორიის დამატება
    if (!parentCategory.subcategories) {
      parentCategory.subcategories = [];
    }
    parentCategory.subcategories.push(savedSubcategory._id);
    await parentCategory.save();

    return savedSubcategory;
  }

  async addSet(categoryId: string, setId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!category.sets) {
      category.sets = [];
    }

    if (!category.sets.includes(new Types.ObjectId(setId))) {
      category.sets.push(new Types.ObjectId(setId));
      await category.save();
    }

    return category;
  }

  async findAllSubcategories(): Promise<any[]> {
    const subcategories = await this.categoryModel.find({ 
      parentId: { $exists: true, $ne: null }, 
      isActive: true 
    })
      .populate('parentId', 'name _id')
      .lean()
      .exec();

    // For each subcategory, count the sets
    const subcategoriesWithSets = await Promise.all(
      subcategories.map(async (subcat) => {
        const sets = await this.setModel.find({ 
          subCategoryId: subcat._id,
          isActive: true 
        })
          .select('_id name thumbnailImage totalExercises totalDuration price')
          .lean()
          .exec();
        
        return {
          ...subcat,
          sets
        };
      })
    );

    return subcategoriesWithSets;
  }
} 