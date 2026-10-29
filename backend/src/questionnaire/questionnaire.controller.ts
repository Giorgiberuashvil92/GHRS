import { Body, Controller, Get, Header, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsIn, IsString, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionnaireService } from './questionnaire.service';
import { SubmitQuestionnaireDto } from './dto/submit-questionnaire.dto';
class ReviewDto {
  @IsIn(['new', 'reviewed']) status: string;
  @IsString() @MaxLength(5000) curatorNotes: string;
}
type AuthRequest = { user: { userId: string; email: string } };
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}
  @Get('options') options() { return this.service.options(); }
  @Header('Cache-Control', 'no-store')
  @Get('me') @UseGuards(JwtAuthGuard)
  latest(@Req() req: AuthRequest) { return this.service.latest(req.user.userId); }
  @Header('Cache-Control', 'no-store')
  @Post('me') @UseGuards(JwtAuthGuard)
  submit(@Req() req: AuthRequest, @Body() answers: SubmitQuestionnaireDto) { return this.service.submit(req.user.userId, answers); }
  @Header('Cache-Control', 'no-store')
  @Get('admin')
  list(@Query('search') search?: string, @Query('status') status?: string, @Query('page') page?: string) { return this.service.list(search, status, page); }
  @Header('Cache-Control', 'no-store')
  @Patch('admin/:id')
  review(@Param('id') id: string, @Body() body: ReviewDto) { return this.service.review(id, body.status, body.curatorNotes, 'Admin'); }
}
