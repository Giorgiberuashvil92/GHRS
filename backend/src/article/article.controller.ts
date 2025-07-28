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
  UploadedFiles,
  BadRequestException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import cloudinary from '../cloudinary.config';
import * as streamifier from 'streamifier';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  private uploadToCloudinary = (file: Express.Multer.File, resource_type: 'image' | 'video') => {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type,
          folder: 'grs/articles',
          transformation: resource_type === 'image' ? [
            { width: 1400, height: 518, crop: 'fill' },
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
  async createJson(@Body() createArticleDto: CreateArticleDto) {

    try {
      const result = await this.articleService.create(createArticleDto);
      return result;
    } catch (error) {
      console.error('❌ Error in create article JSON controller:', error);
      throw new BadRequestException(error.message || 'Failed to create article');
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createArticleDto: any,
  ) {

    try {
      // Parse JSON strings from FormData
      const parsedData = {
        ...createArticleDto,
        title: JSON.parse(createArticleDto.title),
        excerpt: JSON.parse(createArticleDto.excerpt),
        content: JSON.parse(createArticleDto.content),
        author: JSON.parse(createArticleDto.author),
        tableOfContents: createArticleDto.tableOfContents ? JSON.parse(createArticleDto.tableOfContents) : [],
        tags: createArticleDto.tags ? JSON.parse(createArticleDto.tags) : [],
      };

      let featuredImages: string[] = [];

      // Upload images to Cloudinary if provided
      if (files && files.length > 0) {
        
        const uploadPromises = files.map(file => this.uploadToCloudinary(file, 'image'));
        const uploadResults = await Promise.all(uploadPromises);
        
        featuredImages = uploadResults.map((result: any) => result.secure_url);
      }

      const articleData = {
        ...parsedData,
        featuredImages,
      };

      const result = await this.articleService.create(articleData);
      return result;
    } catch (error) {
      console.error('❌ Error in create article controller:', error);
      throw new BadRequestException(error.message || 'Failed to create article');
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.articleService.findAll(query);
  }

  @Get('featured')
  async findFeatured() {
    return this.articleService.findFeatured();
  }

  @Get('popular')
  async findPopular(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 6;
    return this.articleService.findPopular(limitNum);
  }

  @Get('search')
  async search(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      throw new BadRequestException('Search term is required');
    }
    return this.articleService.search(searchTerm);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.articleService.findByCategory(categoryId);
  }

  @Get('blog/:blogId')
  async findByBlog(@Param('blogId') blogId: string) {
    return this.articleService.findByBlog(blogId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateArticleDto: any,
  ) {

    try {
      // Parse JSON strings from FormData
      const parsedData: any = {};
      
      if (updateArticleDto.title) parsedData.title = JSON.parse(updateArticleDto.title);
      if (updateArticleDto.excerpt) parsedData.excerpt = JSON.parse(updateArticleDto.excerpt);
      if (updateArticleDto.content) parsedData.content = JSON.parse(updateArticleDto.content);
      if (updateArticleDto.author) parsedData.author = JSON.parse(updateArticleDto.author);
      if (updateArticleDto.tableOfContents) parsedData.tableOfContents = JSON.parse(updateArticleDto.tableOfContents);
      if (updateArticleDto.tags) parsedData.tags = JSON.parse(updateArticleDto.tags);
      
      // Copy other simple fields
      ['categoryId', 'readTime', 'isPublished', 'isFeatured', 'isActive', 'sortOrder'].forEach(field => {
        if (updateArticleDto[field] !== undefined) {
          parsedData[field] = updateArticleDto[field];
        }
      });

      // Upload new images if provided
      if (files && files.length > 0) {
        
        const uploadPromises = files.map(file => this.uploadToCloudinary(file, 'image'));
        const uploadResults = await Promise.all(uploadPromises);
        
        const newImages = uploadResults.map((result: any) => result.secure_url);
        
        // Merge with existing images or replace them
        parsedData.featuredImages = newImages;
      }

      const result = await this.articleService.update(id, parsedData);
      return result;
    } catch (error) {
      console.error('❌ Error in update article controller:', error);
      throw new BadRequestException(error.message || 'Failed to update article');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Post(':id/like')
  async incrementLikes(@Param('id') id: string) {
    return this.articleService.incrementLikes(id);
  }
} 