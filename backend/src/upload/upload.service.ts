import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './interfaces/cloudinary-response';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
    folder = 'courses',
  ): Promise<CloudinaryResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.uploadToCloudinary(file.path, folder);
      
      // Delete the temporary file
      fs.unlinkSync(file.path);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error) {
      // Delete the temporary file in case of error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder = 'courses',
  ): Promise<CloudinaryResponse[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new BadRequestException('Failed to delete image: ' + error.message);
    }
  }

  private async uploadToCloudinary(
    filePath: string,
    folder: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 1000, crop: 'limit' }, // Limit max width to 1000px
            { quality: 'auto:good' }, // Automatic quality optimization
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });
  }
} 