import {
  BadRequestException,
  Controller,
  Post,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary, { isCloudinaryConfigured } from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('No file uploaded');
    }

    if (!isCloudinaryConfigured()) {
      throw new ServiceUnavailableException(
        'Image upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env (see .env.example).',
      );
    }

    try {
      return await new Promise<{ url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            if (!result?.secure_url) {
              return reject(new Error('Cloudinary returned no URL'));
            }
            resolve({ url: result.secure_url });
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Image upload failed';
      if (message.includes('api_key') || message.includes('Must supply')) {
        throw new ServiceUnavailableException(
          'Cloudinary rejected the request: check CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in backend/.env.',
        );
      }
      throw new BadRequestException(message);
    }
  }
}
