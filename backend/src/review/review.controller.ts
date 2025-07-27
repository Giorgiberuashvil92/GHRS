import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ReviewModerationDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.createReview(
      createReviewDto,
      req.user.id,
      req.user.name,
      req.user.avatar,
    );
  }

  @Get('course/:courseId')
  async getReviewsByCourse(
    @Param('courseId') courseId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('approved') approved: boolean = true,
  ) {
    return this.reviewService.findAllReviews(courseId, page, limit, approved);
  }

  @Get('course/:courseId/rating')
  async getCourseRating(@Param('courseId') courseId: string) {
    return this.reviewService.getCourseRating(courseId);
  }

  @Get('course/:courseId/user')
  @UseGuards(JwtAuthGuard)
  async getUserReviewForCourse(
    @Param('courseId') courseId: string,
    @Request() req,
  ) {
    return this.reviewService.getUserReviewForCourse(req.user.id, courseId);
  }

  @Get('top-rated-courses')
  async getTopRatedCourses(@Query('limit') limit: number = 10) {
    return this.reviewService.getTopRatedCourses(limit);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.findReviewById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewService.updateReview(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id') id: string, @Request() req) {
    return this.reviewService.deleteReview(id, req.user.id);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard) // Add role-based guard for admin access
  async moderateReview(
    @Param('id') id: string,
    @Body() moderationDto: ReviewModerationDto,
  ) {
    return this.reviewService.moderateReview(id, moderationDto);
  }

  @Post(':id/helpful')
  @HttpCode(HttpStatus.OK)
  async markHelpful(@Param('id') id: string) {
    return this.reviewService.incrementHelpfulCount(id);
  }
} 