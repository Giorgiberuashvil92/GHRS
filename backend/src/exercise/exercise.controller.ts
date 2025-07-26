import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('file', 2, { storage: memoryStorage() }))
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() data: any) {
    console.log('--- [CONTROLLER] Create Exercise ---');
    console.log('Files received:', files?.length);
    console.log('Body:', data);

    try {
      const parsedData = {
        ...data,
        name: JSON.parse(data.name),
        description: JSON.parse(data.description),
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
          // Determine if the file is a video or image based on mimetype
          const isVideo = file.mimetype.startsWith('video/');
          
          try {
            const uploadedUrl = await this.uploadToCloudinary(file, isVideo ? 'video' : 'image');
            if (isVideo) {
              videoUrl = uploadedUrl;
            } else {
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
  @UseInterceptors(FilesInterceptor('file', 2, { storage: memoryStorage() }))
  async update(
    @Param('id') id: string, 
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      console.log('--- [CONTROLLER] Update Exercise ---');
      console.log('Files received:', files?.length);
      console.log('Body:', data);

      const updateData: any = { ...data };

      // Parse localized fields if they exist
      if (data.name) updateData.name = JSON.parse(data.name);
      if (data.description) updateData.description = JSON.parse(data.description);

      // Handle direct URLs
      if (data.videoUrl) {
        updateData.videoUrl = data.videoUrl.trim();
      }
      if (data.thumbnailUrl) {
        updateData.thumbnailUrl = data.thumbnailUrl.trim();
      }

      // Handle file uploads
      if (files && files.length > 0) {
        for (const file of files) {
          const isVideo = file.mimetype.startsWith('video/');
          try {
            const uploadedUrl = await this.uploadToCloudinary(file, isVideo ? 'video' : 'image');
            if (isVideo) {
              updateData.videoUrl = uploadedUrl;
            } else {
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(id);
  }
} 