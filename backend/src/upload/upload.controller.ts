import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
