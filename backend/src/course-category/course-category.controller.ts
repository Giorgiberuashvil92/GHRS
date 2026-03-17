import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseCategoryService } from './course-category.service';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('course-categories')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  private uploadToCloudinary = (file: Express.Multer.File, resource_type: 'image' | 'video') => {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  };

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: any,
  ) {
    try {
      const parsedData = {
        ...createDto,
        name: typeof createDto.name === 'string' ? JSON.parse(createDto.name) : createDto.name,
        description: createDto.description
          ? (typeof createDto.description === 'string'
              ? JSON.parse(createDto.description)
              : createDto.description)
          : undefined,
      };

      let imageUrl: string | undefined;
      if (file?.buffer) {
        imageUrl = await this.uploadToCloudinary(file, 'image');
      } else if (createDto.image) {
        imageUrl = createDto.image;
      } else if (createDto.imageUrl) {
        imageUrl = createDto.imageUrl;
      }

      const result = await this.courseCategoryService.create({
        ...parsedData,
        ...(imageUrl && { image: imageUrl }),
      });
      return result;
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error?.message ?? 'Failed to create course category');
    }
  }

  @Get()
  findAll() {
    return this.courseCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: any,
  ) {
    try {
      const parsedData = { ...updateDto };
      if (typeof updateDto.name === 'string') parsedData.name = JSON.parse(updateDto.name);
      if (typeof updateDto.description === 'string')
        parsedData.description = JSON.parse(updateDto.description);

      let imageUrl = updateDto.image ?? updateDto.imageUrl;
      if (file?.buffer) {
        imageUrl = await this.uploadToCloudinary(file, 'image');
      }
      if (imageUrl) parsedData.image = imageUrl;

      return this.courseCategoryService.update(id, parsedData);
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error?.message ?? 'Failed to update');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCategoryService.remove(id);
  }

  @Get(':id/subcategories')
  getSubcategories(@Param('id') id: string) {
    return this.courseCategoryService.getSubcategories(id);
  }

  @Get(':id/subcategories/:subId')
  getSubCategoryById(
    @Param('id') id: string,
    @Param('subId') subId: string,
  ) {
    return this.courseCategoryService.getSubCategoryById(id, subId);
  }

  @Post(':id/subcategories')
  @UseInterceptors(FileInterceptor('image'))
  async createSubcategory(
    @Param('id') parentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: any,
  ) {
    try {
      const parsedData = {
        ...createDto,
        name: typeof createDto.name === 'string' ? JSON.parse(createDto.name) : createDto.name,
        description: createDto.description
          ? (typeof createDto.description === 'string'
              ? JSON.parse(createDto.description)
              : createDto.description)
          : undefined,
      };

      let imageUrl: string | undefined;
      if (file?.buffer) {
        imageUrl = await this.uploadToCloudinary(file, 'image');
      } else if (createDto.imageUrl) {
        imageUrl = createDto.imageUrl;
      } else if (createDto.image) {
        imageUrl = createDto.image;
      }
      if (imageUrl) parsedData.image = imageUrl;

      return this.courseCategoryService.createSubcategory(parentId, parsedData);
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error?.message ?? 'Failed to create subcategory');
    }
  }

  @Patch(':id/subcategories/:subId')
  @UseInterceptors(FileInterceptor('image'))
  async updateSubCategory(
    @Param('id') id: string,
    @Param('subId') subId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: any,
  ) {
    try {
      const parsedData = { ...updateDto };
      if (typeof updateDto.name === 'string') parsedData.name = JSON.parse(updateDto.name);
      if (typeof updateDto.description === 'string')
        parsedData.description = JSON.parse(updateDto.description);

      let imageUrl = updateDto.image ?? updateDto.imageUrl;
      if (file?.buffer) {
        imageUrl = await this.uploadToCloudinary(file, 'image');
      }
      if (imageUrl) parsedData.image = imageUrl;

      return this.courseCategoryService.updateSubCategory(id, subId, parsedData);
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error?.message ?? 'Failed to update subcategory');
    }
  }

  @Delete(':id/subcategories/:subId')
  deleteSubCategory(
    @Param('id') id: string,
    @Param('subId') subId: string,
  ) {
    return this.courseCategoryService.deleteSubCategory(id, subId);
  }
}
