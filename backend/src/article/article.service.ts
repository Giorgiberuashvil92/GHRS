import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { Blog, BlogDocument } from '../schemas/blog.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel('Blog') private blogModel: Model<BlogDocument>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  }

  // Create new article
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      console.log('📝 Creating new article:', {
        title: createArticleDto.title,
        categoryId: createArticleDto.categoryId,
        author: createArticleDto.author.name
      });

      // Generate slug from English title, fallback to Georgian if English is empty
      const titleForSlug = createArticleDto.title.en || createArticleDto.title.ka;
      const baseSlug = this.generateSlug(titleForSlug);
      
      // Check if slug exists and append number if needed
      let slug = baseSlug;
      let counter = 1;
      while (await this.articleModel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const createdArticle = new this.articleModel({
        ...createArticleDto,
        slug,
        blogId: new Types.ObjectId(createArticleDto.blogId),
        categoryId: createArticleDto.categoryId.map(id => new Types.ObjectId(id)),
      });

      const result = await createdArticle.save();

      // Update the blog's articles array
      await this.blogModel.findByIdAndUpdate(
        createArticleDto.blogId,
        { $push: { articles: result._id } }
      );

      console.log('✅ Article created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('❌ Error creating article:', error);
      throw new BadRequestException(error.message || 'Failed to create article');
    }
  }

  // Get all articles with optional filtering
  async findAll(query: any = {}): Promise<Article[]> {
    try {
      console.log('📚 Fetching articles with query:', query);

      const filter: any = { isActive: true };
      
      // Add filters
      if (query.blogId) {
        filter.blogId = new Types.ObjectId(query.blogId);
      }
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

      const articles = await this.articleModel
        .find(filter)
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1, createdAt: -1 })
        .exec();

      console.log(`✅ Found ${articles.length} articles`);
      return articles;
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      throw new BadRequestException('Failed to fetch articles');
    }
  }

  // Get single article by ID
  async findOne(id: string): Promise<Article> {
    try {
      console.log('📖 Fetching article by ID:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid article ID');
      }

      const article = await this.articleModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .exec();

      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      // Increment views count
      await this.articleModel.updateOne(
        { _id: new Types.ObjectId(id) },
        { $inc: { viewsCount: 1 } }
      );

      console.log('✅ Article found:', article.title);
      return article;
    } catch (error) {
      console.error('❌ Error fetching article:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch article');
    }
  }

  // Update article
  async update(id: string, updateArticleDto: Partial<CreateArticleDto>): Promise<Article> {
    try {
      console.log('📝 Updating article:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid article ID');
      }

      const updateData = { ...updateArticleDto };
      if (updateArticleDto.categoryId) {
        updateData.categoryId = updateArticleDto.categoryId.map(id => new Types.ObjectId(id)) as any;
      }

      const updatedArticle = await this.articleModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          updateData,
          { new: true, runValidators: true }
        )
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .exec();

      if (!updatedArticle) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      console.log('✅ Article updated successfully');
      return updatedArticle;
    } catch (error) {
      console.error('❌ Error updating article:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update article');
    }
  }

  // Delete article (soft delete)
  async remove(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting article:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid article ID');
      }

      const article = await this.articleModel.findById(id);
      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      // Remove article from blog's articles array
      await this.blogModel.findByIdAndUpdate(
        article.blogId,
        { $pull: { articles: new Types.ObjectId(id) } }
      );

      // Soft delete the article
      await this.articleModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { isActive: false },
          { new: true }
        )
        .exec();

      console.log('✅ Article deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting article:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete article');
    }
  }

  // Get featured articles
  async findFeatured(): Promise<Article[]> {
    try {
      console.log('⭐ Fetching featured articles');

      const articles = await this.articleModel
        .find({ 
          isActive: true, 
          isPublished: true, 
          isFeatured: true 
        })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .limit(6)
        .exec();

      console.log(`✅ Found ${articles.length} featured articles`);
      return articles;
    } catch (error) {
      console.error('❌ Error fetching featured articles:', error);
      throw new BadRequestException('Failed to fetch featured articles');
    }
  }

  // Get articles by category
  async findByCategory(categoryId: string): Promise<Article[]> {
    try {
      console.log('📂 Fetching articles by category:', categoryId);

      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }

      const articles = await this.articleModel
        .find({ 
          categoryId: new Types.ObjectId(categoryId),
          isActive: true, 
          isPublished: true 
        })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .exec();

      console.log(`✅ Found ${articles.length} articles in category`);
      return articles;
    } catch (error) {
      console.error('❌ Error fetching articles by category:', error);
      throw new BadRequestException('Failed to fetch articles by category');
    }
  }

  // Search articles
  async search(searchTerm: string): Promise<Article[]> {
    try {
      console.log('🔍 Searching articles with term:', searchTerm);

      const articles = await this.articleModel
        .find({
          isActive: true,
          isPublished: true,
          $or: [
            { 'title.ka': { $regex: searchTerm, $options: 'i' } },
            { 'title.en': { $regex: searchTerm, $options: 'i' } },
            { 'title.ru': { $regex: searchTerm, $options: 'i' } },
            { 'excerpt.ka': { $regex: searchTerm, $options: 'i' } },
            { 'excerpt.en': { $regex: searchTerm, $options: 'i' } },
            { 'excerpt.ru': { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .exec();

      console.log(`✅ Found ${articles.length} articles matching search`);
      return articles;
    } catch (error) {
      console.error('❌ Error searching articles:', error);
      throw new BadRequestException('Failed to search articles');
    }
  }

  // Get popular articles (by views)
  async findPopular(limit: number = 6): Promise<Article[]> {
    try {
      console.log('🔥 Fetching popular articles');

      const articles = await this.articleModel
        .find({ 
          isActive: true, 
          isPublished: true 
        })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ viewsCount: -1, likesCount: -1 })
        .limit(limit)
        .exec();

      console.log(`✅ Found ${articles.length} popular articles`);
      return articles;
    } catch (error) {
      console.error('❌ Error fetching popular articles:', error);
      throw new BadRequestException('Failed to fetch popular articles');
    }
  }

  // Increment likes count
  async incrementLikes(id: string): Promise<Article> {
    try {
      console.log('👍 Incrementing likes for article:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid article ID');
      }

      const article = await this.articleModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { $inc: { likesCount: 1 } },
          { new: true }
        )
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .exec();

      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      console.log('✅ Likes incremented successfully');
      return article;
    } catch (error) {
      console.error('❌ Error incrementing likes:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to increment likes');
    }
  }

  // Get articles by blog
  async findByBlog(blogId: string): Promise<Article[]> {
    try {
      console.log('📚 Fetching articles by blog:', blogId);

      if (!Types.ObjectId.isValid(blogId)) {
        throw new BadRequestException('Invalid blog ID');
      }

      const articles = await this.articleModel
        .find({ 
          blogId: new Types.ObjectId(blogId),
          isActive: true, 
          isPublished: true 
        })
        .populate('blogId', 'title description imageUrl')
        .populate('categoryId', 'name description image')
        .sort({ publishDate: -1 })
        .exec();

      console.log(`✅ Found ${articles.length} articles in blog`);
      return articles;
    } catch (error) {
      console.error('❌ Error fetching articles by blog:', error);
      throw new BadRequestException('Failed to fetch articles by blog');
    }
  }
} 