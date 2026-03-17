import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseCategory, CourseCategoryDocument } from '../schemas/course-category.schema';

@Injectable()
export class CourseCategoryService {
  constructor(
    @InjectModel(CourseCategory.name)
    private courseCategoryModel: Model<CourseCategoryDocument>,
  ) {}

  async create(dto: any): Promise<CourseCategory> {
    const doc = new this.courseCategoryModel(dto);
    return doc.save();
  }

  async findAll(): Promise<CourseCategory[]> {
    return this.courseCategoryModel
      .find()
      .select('name description image isActive sortOrder isPublished parentId')
      .sort({ sortOrder: 1 })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<CourseCategory> {
    const category = await this.courseCategoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Course category not found');
    }
    return category;
  }

  async update(id: string, dto: any): Promise<CourseCategory> {
    const category = await this.courseCategoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException('Course category not found');
    }
    return category;
  }

  async remove(id: string): Promise<CourseCategory> {
    const category = await this.courseCategoryModel.findByIdAndDelete(id).exec();
    if (!category) {
      throw new NotFoundException('Course category not found');
    }
    return category;
  }

  async getSubcategories(parentId: string): Promise<CourseCategory[]> {
    return this.courseCategoryModel
      .find({ parentId: new Types.ObjectId(parentId) })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();
  }

  async getSubCategoryById(parentId: string, subId: string): Promise<CourseCategory> {
    const sub = await this.courseCategoryModel
      .findOne({
        _id: new Types.ObjectId(subId),
        parentId: new Types.ObjectId(parentId),
      })
      .exec();
    if (!sub) {
      throw new NotFoundException('Course subcategory not found');
    }
    return sub;
  }

  async createSubcategory(parentId: string, dto: any): Promise<CourseCategory> {
    const parent = await this.courseCategoryModel.findById(parentId).exec();
    if (!parent) {
      throw new NotFoundException('Parent course category not found');
    }
    const sub = new this.courseCategoryModel({
      ...dto,
      parentId: new Types.ObjectId(parentId),
    });
    return sub.save();
  }

  async updateSubCategory(
    parentId: string,
    subId: string,
    dto: any,
  ): Promise<CourseCategory> {
    const sub = await this.courseCategoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(subId),
          parentId: new Types.ObjectId(parentId),
        },
        dto,
        { new: true },
      )
      .exec();
    if (!sub) {
      throw new NotFoundException('Course subcategory not found');
    }
    return sub;
  }

  async deleteSubCategory(parentId: string, subId: string): Promise<void> {
    const result = await this.courseCategoryModel
      .findOneAndDelete({
        _id: new Types.ObjectId(subId),
        parentId: new Types.ObjectId(parentId),
      })
      .exec();
    if (!result) {
      throw new NotFoundException('Course subcategory not found');
    }
  }
}
