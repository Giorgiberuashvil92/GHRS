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
        recommendations: JSON.parse(createSetDto.recommendations),
        levels: createSetDto.levels ? JSON.parse(createSetDto.levels) : undefined,
        price: createSetDto.price ? JSON.parse(createSetDto.price) : undefined,
        additional: createSetDto.additional ? JSON.parse(createSetDto.additional) : undefined,
        discountedPrice: createSetDto.discountedPrice ? JSON.parse(createSetDto.discountedPrice) : undefined,
        equipment: createSetDto.equipment ? JSON.parse(createSetDto.equipment) : undefined,
        warnings: createSetDto.warnings ? JSON.parse(createSetDto.warnings) : undefined,
      };

      console.log('📝 Parsed data:', parsedData);

      if (!parsedData.name.en || !parsedData.name.ru || 
          !parsedData.description.en || !parsedData.description.ru ||
          !parsedData.recommendations.en || !parsedData.recommendations.ru) {
        throw new BadRequestException('All language fields are required');
      }

      let thumbnailImage = '';
      
      if (file && file.buffer) {
        console.log('⬆️ Uploading file to Cloudinary...');
        thumbnailImage = await this.uploadToCloudinary(file, 'image');
        console.log('✅ Cloudinary upload successful:', thumbnailImage);
      } else if (createSetDto.thumbnailImage) {
        console.log('🔗 Using provided thumbnailImage URL:', createSetDto.thumbnailImage);
        thumbnailImage = createSetDto.thumbnailImage;
      } else if (createSetDto.imageUrl) {
        console.log('🔗 Using provided imageUrl URL:', createSetDto.imageUrl);
        thumbnailImage = createSetDto.imageUrl;
      }

      if (!thumbnailImage) {
        throw new BadRequestException('სურათის ატვირთვა ან URL მითითება სავალდებულოა');
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

      // Helper function to safely parse JSON or return the original value if it's already an object
      const safeJSONParse = (value: any) => {
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
        return value;
      };

      if (updateSetDto.name) parsedData.name = safeJSONParse(updateSetDto.name);
      if (updateSetDto.description) parsedData.description = safeJSONParse(updateSetDto.description);
      if (updateSetDto.levels) parsedData.levels = safeJSONParse(updateSetDto.levels);
      if (updateSetDto.price) parsedData.price = safeJSONParse(updateSetDto.price);
      if (updateSetDto.additional) parsedData.additional = safeJSONParse(updateSetDto.additional);
      if (updateSetDto.discountedPrice) parsedData.discountedPrice = safeJSONParse(updateSetDto.discountedPrice);
      if (updateSetDto.equipment) parsedData.equipment = safeJSONParse(updateSetDto.equipment);
      if (updateSetDto.warnings) parsedData.warnings = safeJSONParse(updateSetDto.warnings);
      if (updateSetDto.recommendations) parsedData.recommendations = safeJSONParse(updateSetDto.recommendations);

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
        ...(thumbnailImage && { thumbnailImage }),
      });
      
      console.log('✅ Set updated successfully:', result.name?.en || 'Set');
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