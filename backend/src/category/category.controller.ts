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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private uploadToCloudinary = (file: Express.Multer.File, resource_type: 'image' | 'video') => {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  };

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: any,
  ) {
    console.log('🏗️ Category creation started');
    console.log('📁 File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });
    console.log('📄 Body received:', createCategoryDto);

    try {
      const parseField = (val: any) =>
        typeof val === 'string' ? JSON.parse(val) : val;
      const parsedData = {
        ...createCategoryDto,
        name: parseField(createCategoryDto.name),
        description: createCategoryDto.description ? parseField(createCategoryDto.description) : undefined,
      };

      console.log('📝 Parsed data:', parsedData);

      if (!parsedData.name?.ka) {
        throw new BadRequestException('ქართული ენის ველები სავალდებულოა');
      }

      let imageUrl = '';
      if (file && file.buffer) {
        try {
          console.log('⬆️ Uploading file to Cloudinary...');
          imageUrl = await this.uploadToCloudinary(file, 'image');
          console.log('✅ Cloudinary upload successful:', imageUrl);
        } catch (uploadError: any) {
          console.warn('⚠️ Cloudinary upload failed (credentials may be missing):', uploadError?.message);
        }
      }
      if (!imageUrl && createCategoryDto.image) {
        console.log('🔗 Using provided image URL:', createCategoryDto.image);
        imageUrl = createCategoryDto.image;
      }
      if (!imageUrl && createCategoryDto.imageUrl) {
        console.log('🔗 Using provided imageUrl URL:', createCategoryDto.imageUrl);
        imageUrl = createCategoryDto.imageUrl;
      }

      console.log('💾 Creating category with image URL:', imageUrl || '(none)');

      const result = await this.categoryService.create({
        ...parsedData,
        ...(imageUrl ? { image: imageUrl } : {}),
      });
      
      console.log('✅ Category created successfully:', result.name?.ka || 'Category');
      return result;
    } catch (error) {
      console.error('❌ Category creation error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get(':id/sets')
  getCategorySets(@Param('id') id: string) {
    return this.categoryService.getCategorySets(id);
  }

  @Get(':id/complete')
  getCategoryComplete(@Param('id') id: string) {
    return this.categoryService.getCategoryComplete(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const parsedData = { ...updateCategoryDto };

      if (updateCategoryDto.name) parsedData.name = JSON.parse(updateCategoryDto.name);
      if (updateCategoryDto.description) parsedData.description = JSON.parse(updateCategoryDto.description);

      let imageUrl = updateCategoryDto.image;
      if (file) {
        imageUrl = await this.uploadToCloudinary(file, 'image');
      }

      const result = await this.categoryService.update(id, {
        ...parsedData,
        image: imageUrl,
      });
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Post(':id/subcategories/:subcategoryId')
  addSubcategory(
    @Param('id') id: string,
    @Param('subcategoryId') subcategoryId: string,
  ) {
    return this.categoryService.addSubcategory(id, subcategoryId);
  }

  @Delete(':id/subcategories/:subcategoryId')
  removeSubcategory(
    @Param('id') id: string,
    @Param('subcategoryId') subcategoryId: string,
  ) {
    return this.categoryService.removeSubcategory(id, subcategoryId);
  }

  @Get(':id/subcategories')
  getSubcategories(@Param('id') id: string) {
    return this.categoryService.getSubcategories(id);
  }

  @Get(':id/subcategories/:subcategoryId')
  getSubCategoryById(
    @Param('id') categoryId: string,
    @Param('subcategoryId') subCategoryId: string,
  ) {
    return this.categoryService.getSubCategoryById(categoryId, subCategoryId);
  }

  @Patch(':categoryId/subcategories/:subCategoryId')
  @UseInterceptors(FileInterceptor('image'))
  async updateSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() updateCategoryDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('🔄 Subcategory update started');
    console.log('📁 File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });
    console.log('📄 Body received:', updateCategoryDto);

    try {
      const parsedData = { ...updateCategoryDto };

      if (updateCategoryDto.name) parsedData.name = JSON.parse(updateCategoryDto.name);
      if (updateCategoryDto.description) parsedData.description = JSON.parse(updateCategoryDto.description);

      console.log('📝 Parsed data:', parsedData);

      let imageUrl = updateCategoryDto.image;
      if (file && file.buffer) {
        console.log('⬆️ Uploading file to Cloudinary...');
        imageUrl = await this.uploadToCloudinary(file, 'image');
        console.log('✅ Cloudinary upload successful:', imageUrl);
      } else if (updateCategoryDto.imageUrl) {
        console.log('🔗 Using provided imageUrl URL:', updateCategoryDto.imageUrl);
        imageUrl = updateCategoryDto.imageUrl;
      }

      console.log('💾 Updating subcategory with image URL:', imageUrl);

      const result = await this.categoryService.updateSubCategory(
        categoryId,
        subCategoryId,
        {
          ...parsedData,
          image: imageUrl,
        },
      );
      
      console.log('✅ Subcategory updated successfully:', result.name?.ka || 'Subcategory');
      return result;
    } catch (error) {
      console.error('❌ Subcategory update error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/subcategories/:subcategoryId/sets')
  getSubCategorySets(
    @Param('id') categoryId: string,
    @Param('subcategoryId') subCategoryId: string,
  ) {
    return this.categoryService.getSubCategorySets(categoryId, subCategoryId);
  }

  @Post(':id/subcategories')
  @UseInterceptors(FileInterceptor('image'))
  async createSubcategory(
    @Param('id') parentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: any,
  ) {
    console.log('🏗️ Subcategory creation started');
    console.log('📁 File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });
    console.log('📄 Body received:', createCategoryDto);

    try {
      const parsedData = {
        ...createCategoryDto,
        name: JSON.parse(createCategoryDto.name),
        description: createCategoryDto.description ? JSON.parse(createCategoryDto.description) : undefined,
      };

      console.log('📝 Parsed data:', parsedData);

      if (!parsedData.name.ka) {
        throw new BadRequestException('ქართული ენის ველები სავალდებულოა');
      }

      let imageUrl = '';
      
      if (file && file.buffer) {
        console.log('⬆️ Uploading file to Cloudinary...');
        imageUrl = await this.uploadToCloudinary(file, 'image');
        console.log('✅ Cloudinary upload successful:', imageUrl);
      } else if (createCategoryDto.image) {
        console.log('🔗 Using provided image URL:', createCategoryDto.image);
        imageUrl = createCategoryDto.image;
      } else if (createCategoryDto.imageUrl) {
        console.log('🔗 Using provided imageUrl URL:', createCategoryDto.imageUrl);
        imageUrl = createCategoryDto.imageUrl;
      }

      if (!imageUrl) {
        throw new BadRequestException('სურათის ატვირთვა ან URL მითითება სავალდებულოა');
      }

      console.log('💾 Creating subcategory with image URL:', imageUrl);

      const result = await this.categoryService.createSubcategory(parentId, {
        ...parsedData,
        image: imageUrl,
      });
      
      console.log('✅ Subcategory created successfully:', result.name?.ka || 'Subcategory');
      return result;
    } catch (error) {
      console.error('❌ Subcategory creation error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/sets/:setId')
  addSet(
    @Param('id') id: string,
    @Param('setId') setId: string,
  ) {
    return this.categoryService.addSet(id, setId);
  }

  @Get('subcategories/all')
  findAllSubcategories() {
    return this.categoryService.findAllSubcategories();
  }
}