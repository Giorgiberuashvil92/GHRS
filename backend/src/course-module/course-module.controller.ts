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
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto, UpdateCourseModuleDto } from './dto/create-course-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  // GET /api/courses/{courseId}/modules
  @Get('courses/:courseId/modules')
  findByCourse(
    @Param('courseId') courseId: string,
    @Query('includeUnpublished') includeUnpublished?: boolean,
  ) {
    return this.courseModuleService.findByCourse(courseId, includeUnpublished);
  }

  // POST /api/courses/{courseId}/modules
  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('courseId') courseId: string,
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ) {
    // courseId-ს DTO-ში ავტომატურად ვუსეტავთ
    createCourseModuleDto.courseId = courseId;
    return this.courseModuleService.create(createCourseModuleDto);
  }

  // GET /api/modules/{id}
  @Get('modules/:id')
  findOne(
    @Param('id') id: string,
    @Query('includeLessons') includeLessons?: boolean,
  ) {
    return this.courseModuleService.findOne(id, includeLessons);
  }

  // PATCH /api/modules/{id}
  @UseGuards(JwtAuthGuard)
  @Patch('modules/:id')
  update(
    @Param('id') id: string,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    return this.courseModuleService.update(id, updateCourseModuleDto);
  }

  // DELETE /api/modules/{id}
  @UseGuards(JwtAuthGuard)
  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.courseModuleService.remove(id);
  }

  // POST /api/modules/{id}/duplicate
  @UseGuards(JwtAuthGuard)
  @Post('modules/:id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.courseModuleService.duplicate(id);
  }

  // GET /api/modules/{id}/stats


  // POST /api/courses/{courseId}/modules/reorder
  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/modules/reorder')
  reorderModules(
    @Param('courseId') courseId: string,
    @Body() moduleOrders: { id: string; order: number }[],
  ) {
    return this.courseModuleService.reorderModules(courseId, moduleOrders);
  }
} 