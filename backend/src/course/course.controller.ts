import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isPublished') isPublished?: boolean,
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('instructorId') instructorId?: string,
    @Query('search') search?: string,
    @Query('language') language?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.courseService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      categoryId,
      subcategoryId,
      instructorId,
      search,
      language,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.courseService.findByCategory(categoryId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get('instructor/:instructorId')
  async findByInstructor(
    @Param('instructorId') instructorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.courseService.findByInstructor(instructorId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }
} 