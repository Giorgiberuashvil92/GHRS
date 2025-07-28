import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  private uploadToCloudinary = (file: Express.Multer.File, resource_type: 'image' | 'video') => {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type,
          folder: 'grs/blogs',
          transformation: resource_type === 'image' ? [
            { width: 600, height: 400, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  };

  @Post('json')
  async createJson(@Body() createBlogDto: CreateBlogDto) {
    console.log('📝 Creating blog post with JSON data');
    console.log('Body received:', createBlogDto);

    try {
      const result = await this.blogService.create(createBlogDto);
      return result;
    } catch (error) {
      console.error('❌ Error in create blog JSON controller:', error);
      throw new BadRequestException(error.message || 'Failed to create blog post');
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: any,
  ) {
    console.log('📝 Creating blog post with file upload');
    console.log('File received:', !!file);
    console.log('Body received:', Object.keys(createBlogDto));

    try {
      // Parse JSON strings from FormData
      const parsedData = {
        ...createBlogDto,
        title: JSON.parse(createBlogDto.title),
        description: JSON.parse(createBlogDto.description),
        excerpt: JSON.parse(createBlogDto.excerpt),
        tags: createBlogDto.tags ? JSON.parse(createBlogDto.tags) : [],
      };

      let imageUrl = createBlogDto.imageUrl || '';

      // Upload image to Cloudinary if provided
      if (file) {
        console.log('📤 Uploading image to Cloudinary...');
        const uploadResult = await this.uploadToCloudinary(file, 'image');
        imageUrl = (uploadResult as any).secure_url;
        console.log('✅ Image uploaded successfully:', imageUrl);
      }

      const blogData = {
        ...parsedData,
        imageUrl,
      };

      const result = await this.blogService.create(blogData);
      return result;
    } catch (error) {
      console.error('❌ Error in create blog controller:', error);
      throw new BadRequestException(error.message || 'Failed to create blog post');
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    console.log('📚 GET /blogs - Query params:', query);
    return this.blogService.findAll(query);
  }

  @Get('featured')
  async findFeatured() {
    console.log('⭐ GET /blogs/featured');
    return this.blogService.findFeatured();
  }

  @Get('popular')
  async findPopular(@Query('limit') limit?: string) {
    console.log('🔥 GET /blogs/popular - Limit:', limit);
    const limitNum = limit ? parseInt(limit, 10) : 6;
    return this.blogService.findPopular(limitNum);
  }

  @Get('search')
  async search(@Query('q') searchTerm: string) {
    console.log('🔍 GET /blogs/search - Term:', searchTerm);
    if (!searchTerm) {
      throw new BadRequestException('Search term is required');
    }
    return this.blogService.search(searchTerm);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    console.log('📂 GET /blogs/category/:categoryId - Category:', categoryId);
    return this.blogService.findByCategory(categoryId);
  }

  @Get('with-articles')
  async findAllWithArticles(@Query() query: any) {
    console.log('📚 GET /blogs/with-articles - Query params:', query);
    return this.blogService.findAllWithArticles(query);
  }

  @Get(':id/with-articles')
  async findOneWithArticles(@Param('id') id: string) {
    console.log('📖 GET /blogs/:id/with-articles - ID:', id);
    return this.blogService.findOneWithArticles(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('📖 GET /blogs/:id - ID:', id);
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBlogDto: any,
  ) {
    console.log('📝 PATCH /blogs/:id - ID:', id);
    console.log('File received:', !!file);
    console.log('Body received:', updateBlogDto);

    try {
      const parsedData: any = {};
      
      // Helper function to safely parse JSON or return object as is
      const safeParseJSON = (value: any, fieldName: string) => {
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            throw new BadRequestException(`Invalid JSON format for field: ${fieldName} / Неверный формат JSON для поля: ${fieldName}`);
          }
        } else if (typeof value === 'object' && value !== null) {
          return value;
        }
        return value;
      };

      // Parse complex fields
      if (updateBlogDto.title) {
        parsedData.title = safeParseJSON(updateBlogDto.title, 'title');
      }
      if (updateBlogDto.description) {
        parsedData.description = safeParseJSON(updateBlogDto.description, 'description');
      }
      if (updateBlogDto.excerpt) {
        parsedData.excerpt = safeParseJSON(updateBlogDto.excerpt, 'excerpt');
      }
      if (updateBlogDto.tags) {
        parsedData.tags = safeParseJSON(updateBlogDto.tags, 'tags');
      }
      
      // Copy other simple fields
      ['categoryId', 'isPublished', 'isFeatured', 'isActive', 'sortOrder', 'imageUrl'].forEach(field => {
        if (updateBlogDto[field] !== undefined) {
          parsedData[field] = updateBlogDto[field];
        }
      });

      // Upload new image if provided
      if (file) {
        console.log('📤 Uploading new image to Cloudinary...');
        const uploadResult = await this.uploadToCloudinary(file, 'image');
        parsedData.imageUrl = (uploadResult as any).secure_url;
        console.log('✅ New image uploaded successfully:', parsedData.imageUrl);
      }

      const result = await this.blogService.update(id, parsedData);
      return result;
    } catch (error) {
      console.error('❌ Error in update blog controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update blog post / Не удалось обновить блог: ${error.message}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log('🗑️ DELETE /blogs/:id - ID:', id);
    return this.blogService.remove(id);
  }

  @Post(':id/like')
  async incrementLikes(@Param('id') id: string) {
    console.log('👍 POST /blogs/:id/like - ID:', id);
    return this.blogService.incrementLikes(id);
  }
} 