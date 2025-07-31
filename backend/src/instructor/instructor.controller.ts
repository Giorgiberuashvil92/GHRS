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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto/create-instructor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.instructorService.findAll(page, limit, isActive);
  }

  @Get('top')
  getTopInstructors(@Query('limit') limit?: number) {
    return this.instructorService.getTopInstructors(limit);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.instructorService.update(id, updateInstructorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.instructorService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.instructorService.deactivate(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.instructorService.activate(id);
  }

  // ინსტრუქტორის კურსების ენდპოინტები
  @Get(':id/courses')
  getInstructorCourses(
    @Param('id') instructorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isPublished') isPublished?: boolean,
  ) {
    return this.instructorService.getInstructorCourses(
      instructorId,
      page,
      limit,
      isPublished,
    );
  }

  // ინსტრუქტორის სტატისტიკის ენდპოინტი
  @Get(':id/stats')
  getInstructorStats(@Param('id') instructorId: string) {
    return this.instructorService.getInstructorStats(instructorId);
  }
} 