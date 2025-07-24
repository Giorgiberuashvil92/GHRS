import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Patch, 
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetService } from './set.service';
import { CreateSetDto } from './dto/create-set.dto';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('sets')
export class SetController {
  constructor(private readonly setService: SetService) {}

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
    @Body() createSetDto: any,
  ) {
    console.log('🏗️ Set creation started');
    console.log('📁 File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });
    console.log('📄 Body received:', createSetDto);

    try {
      const parsedData = {
        ...createSetDto,
        name: JSON.parse(createSetDto.name),
        description: JSON.parse(createSetDto.description),
        levels: createSetDto.levels ? JSON.parse(createSetDto.levels) : undefined,
        price: createSetDto.price ? JSON.parse(createSetDto.price) : undefined,
      };

      console.log('📝 Parsed data:', parsedData);

      if (!parsedData.name.ka || !parsedData.description.ka) {
        throw new BadRequestException('ქართული ენის ველები სავალდებულოა');
      }

      let thumbnailImage = '';
      
      if (file && file.buffer) {
        console.log('⬆️ Uploading file to Cloudinary...');
        thumbnailImage = await this.uploadToCloudinary(file, 'image');
        console.log('✅ Cloudinary upload successful:', thumbnailImage);
      } else if (createSetDto.thumbnailImage) {
        console.log('🔗 Using provided image URL:', createSetDto.thumbnailImage);
        thumbnailImage = createSetDto.thumbnailImage;
      }

      if (!thumbnailImage) {
        throw new BadRequestException('სურათის ატვირთვა სავალდებულოა');
      }

      console.log('💾 Creating set with thumbnail:', thumbnailImage);

      const result = await this.setService.create({
        ...parsedData,
        thumbnailImage,
      });
      
      console.log('✅ Set created successfully:', result.name?.ka || 'Set');
      return result;
    } catch (error) {
      console.error('❌ Set creation error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateSetDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('🔄 Set update started');
    console.log('📁 File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });
    console.log('📄 Body received:', updateSetDto);

    try {
      const parsedData = { ...updateSetDto };

      if (updateSetDto.name) parsedData.name = JSON.parse(updateSetDto.name);
      if (updateSetDto.description) parsedData.description = JSON.parse(updateSetDto.description);
      if (updateSetDto.levels) parsedData.levels = JSON.parse(updateSetDto.levels);
      if (updateSetDto.price) parsedData.price = JSON.parse(updateSetDto.price);

      console.log('📝 Parsed data:', parsedData);

      let thumbnailImage = updateSetDto.thumbnailImage;
      if (file && file.buffer) {
        console.log('⬆️ Uploading file to Cloudinary...');
        thumbnailImage = await this.uploadToCloudinary(file, 'image');
        console.log('✅ Cloudinary upload successful:', thumbnailImage);
      }

      console.log('💾 Updating set with thumbnail:', thumbnailImage);

      const result = await this.setService.update(id, {
        ...parsedData,
        thumbnailImage,
      });
      
      console.log('✅ Set updated successfully:', result.name?.ka || 'Set');
      return result;
    } catch (error) {
      console.error('❌ Set update error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@Query() query: { categoryId?: string; subCategoryId?: string }) {
    return this.setService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setService.remove(id);
  }
} 