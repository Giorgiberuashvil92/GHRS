import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import * as streamifier from 'streamifier';
import { memoryStorage } from 'multer';
import { Types } from 'mongoose';
import cloudinary from '../cloudinary.config';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  // Helper function to upload to Cloudinary
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
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() data: any) {
    console.log('--- [CONTROLLER] Create Exercise ---');
    console.log('Files received:', files?.length);
    console.log('Body:', data);

    try {
      // Parse and clean localized fields
      const nameObj = JSON.parse(data.name);
      const cleanName = {
        en: nameObj.en,
        ru: nameObj.ru,
        ...(nameObj.ka && { ka: nameObj.ka })
      };

      let cleanDescription;
      if (data.description) {
        const descObj = JSON.parse(data.description);
        cleanDescription = {
          en: descObj.en,
          ru: descObj.ru,
          ...(descObj.ka && { ka: descObj.ka })
        };
      }

      const parsedData = {
        ...data,
        name: cleanName,
        description: cleanDescription,
      };

      let videoUrl = '';
      let thumbnailUrl = '';

      // Handle direct URLs first
      if (data.videoUrl) {
        videoUrl = data.videoUrl.trim();
      }
      if (data.thumbnailUrl) {
        thumbnailUrl = data.thumbnailUrl.trim();
      }

      // Handle file uploads
      if (files && files.length > 0) {
        for (const file of files) {
          // Determine if the file is a video or image based on mimetype and fieldname
          const isVideo = file.mimetype.startsWith('video/');
          const isThumbnailFile = file.fieldname === 'thumbnailFile' || file.fieldname === 'thumbnail';
          const isVideoFile = file.fieldname === 'videoFile' || file.fieldname === 'video';
          
          try {
            const uploadedUrl = await this.uploadToCloudinary(file, isVideo ? 'video' : 'image');
            
            // Determine which field to update based on fieldname or mimetype
            if (isVideoFile || (isVideo && !isThumbnailFile)) {
              videoUrl = uploadedUrl;
            } else if (isThumbnailFile || !isVideo) {
              thumbnailUrl = uploadedUrl;
            }
          } catch (error) {
            console.error(`Error uploading ${isVideo ? 'video' : 'image'} to Cloudinary:`, error);
            throw new BadRequestException(`Failed to upload ${isVideo ? 'video' : 'image'}`);
          }
        }
      }

      // Validate that we have both thumbnail and video
      if (!thumbnailUrl) {
        throw new BadRequestException('სურათის ატვირთვა ან URL მითითება სავალდებულოა');
      }
      if (!videoUrl) {
        throw new BadRequestException('ვიდეოს ატვირთვა ან URL მითითება სავალდებულოა');
      }

      console.log('Final data:', {
        ...parsedData,
        videoUrl,
        thumbnailUrl,
      });

      const result = await this.exerciseService.create({
        ...parsedData,
        videoUrl,
        thumbnailUrl,
      });

      console.log('Exercise created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating exercise:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@Query() query: { categoryId?: string; subCategoryId?: string }) {
    return this.exerciseService.findAll(query);
  }

  @Get('set/:setId')
  findBySet(@Param('setId') setId: string) {
    return this.exerciseService.findBySet(setId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.exerciseService.findByCategory(categoryId);
  }

  @Get('popular')
  findPopular() {
    return this.exerciseService.findPopular();
  }

  @Get('difficulty/:difficulty')
  findByDifficulty(@Param('difficulty') difficulty: 'easy' | 'medium' | 'hard') {
    return this.exerciseService.findByDifficulty(difficulty);
  }

  @Patch('bulk/popular')
  bulkSetPopular(@Body() body: { exerciseIds: string[]; isPopular: boolean }) {
    return this.exerciseService.bulkSetPopular(body.exerciseIds, body.isPopular);
  }

  @Patch(':id/popular')
  setPopular(@Param('id') id: string, @Body() body: { isPopular: boolean }) {
    console.log('🔥 setPopular called with:', { id, body });
    return this.exerciseService.setPopular(id, body.isPopular);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async update(
    @Param('id') id: string, 
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      console.log('--- [CONTROLLER] Update Exercise ---');
      console.log('Files received:', files?.length);
      console.log('Files details:', files?.map(f => ({ fieldname: f.fieldname, mimetype: f.mimetype, size: f.size })));
      console.log('Body:', data);

      const updateData: any = { ...data };

      // Parse localized fields if they exist and clean them
      if (data.name) {
        const nameObj = JSON.parse(data.name);
        // Remove any extra fields like _id, id
        updateData.name = {
          en: nameObj.en,
          ru: nameObj.ru,
          ...(nameObj.ka && { ka: nameObj.ka })
        };
      }
      if (data.description) {
        const descObj = JSON.parse(data.description);
        // Remove any extra fields like _id, id
        updateData.description = {
          en: descObj.en,
          ru: descObj.ru,
          ...(descObj.ka && { ka: descObj.ka })
        };
      }

      // Handle direct URLs
      if (data.videoUrl && data.videoUrl.trim() !== 'thumbnailFile' && data.videoUrl.trim() !== 'videoFile') {
        updateData.videoUrl = data.videoUrl.trim();
      }
      if (data.thumbnailUrl) {
        updateData.thumbnailUrl = data.thumbnailUrl.trim();
      }

      // Handle file uploads
      if (files && files.length > 0) {
        for (const file of files) {
          const isVideo = file.mimetype.startsWith('video/');
          const isThumbnailFile = file.fieldname === 'thumbnailFile' || file.fieldname === 'thumbnail';
          const isVideoFile = file.fieldname === 'videoFile' || file.fieldname === 'video';
          
          try {
            const uploadedUrl = await this.uploadToCloudinary(file, isVideo ? 'video' : 'image');
            
            // Determine which field to update based on fieldname or mimetype
            if (isVideoFile || (isVideo && !isThumbnailFile)) {
              updateData.videoUrl = uploadedUrl;
            } else if (isThumbnailFile || !isVideo) {
              updateData.thumbnailUrl = uploadedUrl;
            }
          } catch (error) {
            console.error(`Error uploading ${isVideo ? 'video' : 'image'} to Cloudinary:`, error);
            throw new BadRequestException(`Failed to upload ${isVideo ? 'video' : 'image'}`);
          }
        }
      }

      // For update, we don't require both media types to be present
      // as the user might want to update only one of them

      console.log('Final update data:', updateData);
      return this.exerciseService.update(id, updateData);
    } catch (error) {
      console.error('❌ Error updating exercise:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Provide more detailed error message
      if (error.message.includes('validation')) {
        throw new BadRequestException(`Validation error: ${error.message}`);
      }
      
      throw new BadRequestException(`Update failed: ${error.message}`);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(id);
  }
} 