import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  // Create new blog post
  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    try {
      console.log('📝 Creating new blog post:', {
        title: createBlogDto.title,
        categoryId: createBlogDto.categoryId
      });

      const createdBlog = new this.blogModel({
        ...createBlogDto,
        categoryId: new Types.ObjectId(createBlogDto.categoryId),
      });

      const result = await createdBlog.save();
      console.log('✅ Blog post created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('❌ Error creating blog post:', error);
      throw new BadRequestException('Failed to create blog post');
    }
  }

  // Get all blog posts with optional filtering
  async findAll(query: any = {}): Promise<Blog[]> {
    try {
      console.log('📚 Fetching blog posts with query:', query);

      const filter: any = { isActive: true };
      
      // Add filters
      if (query.categoryId) {
        filter.categoryId = new Types.ObjectId(query.categoryId);
      }
      if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished === 'true';
      }
      if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === 'true';
      }
      if (query.tags) {
        filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };
      }

      const blogs = await this.blogModel
        .find(filter)
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1, createdAt: -1 })
        .exec();

      console.log(`✅ Found ${blogs.length} blog posts`);
      return blogs;
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error);
      throw new BadRequestException('Failed to fetch blog posts');
    }
  }

  // Get single blog post by ID
  async findOne(id: string): Promise<Blog> {
    try {
      console.log('📖 Fetching blog post by ID:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog post ID');
      }

      const blog = await this.blogModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .populate('categoryId', 'name description image')
        .exec();

      if (!blog) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }

      // Increment views count
      await this.blogModel.updateOne(
        { _id: new Types.ObjectId(id) },
        { $inc: { viewsCount: 1 } }
      );

      console.log('✅ Blog post found:', blog.title);
      return blog;
    } catch (error) {
      console.error('❌ Error fetching blog post:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch blog post');
    }
  }

  // Update blog post
  async update(id: string, updateBlogDto: Partial<CreateBlogDto>): Promise<Blog> {
    try {
      console.log('📝 Updating blog post:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog post ID');
      }

      const updateData = { ...updateBlogDto };
      if (updateBlogDto.categoryId) {
        updateData.categoryId = new Types.ObjectId(updateBlogDto.categoryId) as any;
      }

      const updatedBlog = await this.blogModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          updateData,
          { new: true, runValidators: true }
        )
        .populate('categoryId', 'name description image')
        .exec();

      if (!updatedBlog) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }

      console.log('✅ Blog post updated successfully');
      return updatedBlog;
    } catch (error) {
      console.error('❌ Error updating blog post:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update blog post');
    }
  }

  // Delete blog post (soft delete)
  async remove(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting blog post:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog post ID');
      }

      const result = await this.blogModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { isActive: false },
          { new: true }
        )
        .exec();

      if (!result) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }

      console.log('✅ Blog post deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting blog post:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete blog post');
    }
  }

  // Get featured blog posts
  async findFeatured(): Promise<Blog[]> {
    try {
      console.log('⭐ Fetching featured blog posts');

      const blogs = await this.blogModel
        .find({ 
          isActive: true, 
          isPublished: true, 
          isFeatured: true 
        })
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .limit(6)
        .exec();

      console.log(`✅ Found ${blogs.length} featured blog posts`);
      return blogs;
    } catch (error) {
      console.error('❌ Error fetching featured blog posts:', error);
      throw new BadRequestException('Failed to fetch featured blog posts');
    }
  }

  // Get blog posts by category
  async findByCategory(categoryId: string): Promise<Blog[]> {
    try {
      console.log('📂 Fetching blog posts by category:', categoryId);

      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }

      const blogs = await this.blogModel
        .find({ 
          categoryId: new Types.ObjectId(categoryId),
          isActive: true, 
          isPublished: true 
        })
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .exec();

      console.log(`✅ Found ${blogs.length} blog posts in category`);
      return blogs;
    } catch (error) {
      console.error('❌ Error fetching blog posts by category:', error);
      throw new BadRequestException('Failed to fetch blog posts by category');
    }
  }

  // Search blog posts
  async search(searchTerm: string): Promise<Blog[]> {
    try {
      console.log('🔍 Searching blog posts with term:', searchTerm);

      const blogs = await this.blogModel
        .find({
          isActive: true,
          isPublished: true,
          $or: [
            { 'title.ka': { $regex: searchTerm, $options: 'i' } },
            { 'title.en': { $regex: searchTerm, $options: 'i' } },
            { 'title.ru': { $regex: searchTerm, $options: 'i' } },
            { 'description.ka': { $regex: searchTerm, $options: 'i' } },
            { 'description.en': { $regex: searchTerm, $options: 'i' } },
            { 'description.ru': { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        })
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .exec();

      console.log(`✅ Found ${blogs.length} blog posts matching search`);
      return blogs;
    } catch (error) {
      console.error('❌ Error searching blog posts:', error);
      throw new BadRequestException('Failed to search blog posts');
    }
  }

  // Get popular blog posts (by views)
  async findPopular(limit: number = 6): Promise<Blog[]> {
    try {
      console.log('🔥 Fetching popular blog posts');

      const blogs = await this.blogModel
        .find({ 
          isActive: true, 
          isPublished: true 
        })
        .populate('categoryId', 'name description image')
        .sort({ viewsCount: -1, likesCount: -1 })
        .limit(limit)
        .exec();

      console.log(`✅ Found ${blogs.length} popular blog posts`);
      return blogs;
    } catch (error) {
      console.error('❌ Error fetching popular blog posts:', error);
      throw new BadRequestException('Failed to fetch popular blog posts');
    }
  }

  // Increment likes count
  async incrementLikes(id: string): Promise<Blog> {
    try {
      console.log('👍 Incrementing likes for blog post:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog post ID');
      }

      const blog = await this.blogModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { $inc: { likesCount: 1 } },
          { new: true }
        )
        .populate('categoryId', 'name description image')
        .exec();

      if (!blog) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }

      console.log('✅ Likes incremented successfully');
      return blog;
    } catch (error) {
      console.error('❌ Error incrementing likes:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to increment likes');
    }
  }

  // Get all blogs with articles
  async findAllWithArticles(query: any = {}): Promise<Blog[]> {
    try {
      console.log('📚 Fetching blogs with articles');

      const filter: any = { isActive: true };
      
      // Add filters
      if (query.isPublished !== undefined) {
        filter.isPublished = query.isPublished === 'true';
      }
      if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === 'true';
      }
      if (query.categoryId) {
        filter.categoryId = new Types.ObjectId(query.categoryId);
      }

      const blogs = await this.blogModel
        .find(filter)
        .populate({
          path: 'articles',
          match: { isActive: true },
          select: 'title excerpt author readTime viewsCount likesCount createdAt',
          options: { sort: { createdAt: -1 } }
        })
        .populate('categoryId', 'name description image')
        .sort({ sortOrder: 1, createdAt: -1 })
        .exec();

      console.log(`✅ Found ${blogs.length} blogs with articles`);
      return blogs;
    } catch (error) {
      console.error('❌ Error fetching blogs with articles:', error);
      throw new BadRequestException('Failed to fetch blogs with articles');
    }
  }

  // Get single blog with articles
  async findOneWithArticles(id: string): Promise<Blog> {
    try {
      console.log('📖 Fetching blog with articles by ID:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid blog ID');
      }

      const blog = await this.blogModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .populate({
          path: 'articles',
          match: { isActive: true },
          select: 'title excerpt author readTime viewsCount likesCount createdAt',
          options: { sort: { createdAt: -1 } }
        })
        .populate('categoryId', 'name description image')
        .exec();

      if (!blog) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }

      console.log('✅ Blog found with articles:', blog.title);
      return blog;
    } catch (error) {
      console.error('❌ Error fetching blog with articles:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch blog with articles');
    }
  }
} 