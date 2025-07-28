import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseReview, CourseReviewDocument } from '../schemas/course-review.schema';
import { CourseRating, CourseRatingDocument } from '../schemas/course-rating.schema';
import { Course, CourseDocument } from '../schemas/course.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ReviewModerationDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(CourseReview.name)
    private reviewModel: Model<CourseReviewDocument>,
    @InjectModel(CourseRating.name)
    private ratingModel: Model<CourseRatingDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, userId: string, userName: string, userAvatar?: string): Promise<CourseReview> {
    // Check if user already reviewed this course
    const existingReview = await this.reviewModel.findOne({
      courseId: new Types.ObjectId(createReviewDto.courseId),
      userId: new Types.ObjectId(userId),
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this course');
    }

    const review = new this.reviewModel({
      ...createReviewDto,
      courseId: new Types.ObjectId(createReviewDto.courseId),
      userId: new Types.ObjectId(userId),
      userName,
      userAvatar,
    });

    const savedReview = await review.save();
    
    // Update course rating
    await this.updateCourseRating(createReviewDto.courseId);
    
    return savedReview;
  }

  async findAllReviews(courseId: string, page: number = 1, limit: number = 10, approved: boolean = true) {
    const query: any = { courseId: new Types.ObjectId(courseId) };
    if (approved) {
      query.isApproved = true;
    }

    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name avatar')
        .exec(),
      this.reviewModel.countDocuments(query),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findReviewById(id: string): Promise<CourseReview> {
    const review = await this.reviewModel
      .findById(id)
      .populate('userId', 'name avatar')
      .populate('courseId', 'title')
      .exec();
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    return review;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<CourseReview> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    if (review.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('userId', 'name avatar')
      .exec();

    // Update course rating if rating changed
    if (updateReviewDto.rating) {
      await this.updateCourseRating(review.courseId.toString());
    }

    return updatedReview;
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    if (review.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const courseId = review.courseId.toString();
    await this.reviewModel.findByIdAndDelete(id);
    
    // Update course rating
    await this.updateCourseRating(courseId);
  }

  async moderateReview(id: string, moderationDto: ReviewModerationDto): Promise<CourseReview> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { isApproved: moderationDto.isApproved }, { new: true })
      .populate('userId', 'name avatar')
      .exec();
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    // Update course rating
    await this.updateCourseRating(review.courseId.toString());
    
    return review;
  }

  async incrementHelpfulCount(id: string): Promise<CourseReview> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true })
      .populate('userId', 'name avatar')
      .exec();
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    return review;
  }

  async getCourseRating(courseId: string): Promise<CourseRating> {
    let rating = await this.ratingModel.findOne({ courseId: new Types.ObjectId(courseId) });
    
    if (!rating) {
      // Create initial rating record
      rating = new this.ratingModel({
        courseId: new Types.ObjectId(courseId),
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedReviewsCount: 0,
      });
      await rating.save();
    }
    
    return rating;
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    const courseObjectId = new Types.ObjectId(courseId);
    
    // Get all approved reviews for this course
    const reviews = await this.reviewModel.find({
      courseId: courseObjectId,
      isApproved: true,
    });

    const totalReviews = reviews.length;
    const verifiedReviewsCount = reviews.filter(r => r.isVerified).length;
    
    let averageRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (totalReviews > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Number((totalRating / totalReviews).toFixed(1));
      
      // Calculate distribution
      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });
    }

    // Update or create rating record
    await this.ratingModel.findOneAndUpdate(
      { courseId: courseObjectId },
      {
        averageRating,
        totalReviews,
        ratingDistribution,
        verifiedReviewsCount,
      },
      { upsert: true, new: true }
    );

    // Also update the course document with rating information
    await this.courseModel.findByIdAndUpdate(courseObjectId, {
      averageRating,
      totalReviews,
      ratingDistribution,
    });
  }

  async getUserReviewForCourse(userId: string, courseId: string): Promise<CourseReview | null> {
    return this.reviewModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });
  }

  async getTopRatedCourses(limit: number = 10) {
    return this.ratingModel
      .find({ totalReviews: { $gte: 5 } }) // At least 5 reviews
      .sort({ averageRating: -1 })
      .limit(limit)
      .populate('courseId', 'title description thumbnail price')
      .exec();
  }
} 