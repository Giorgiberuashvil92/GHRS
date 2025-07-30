import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  async getUserPurchases(@Request() req) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.purchaseService.getUserPurchases(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-access/:setId')
  async checkAccess(@Request() req, @Param('setId') setId: string) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.purchaseService.checkUserAccess(userId, setId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-course-access/:courseId')
  async checkCourseAccess(@Request() req, @Param('courseId') courseId: string) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.purchaseService.checkUserCourseAccess(userId, courseId);
  }

  // Debug endpoint - remove in production
  @Get('debug/:userId')
  async debugPurchases(@Param('userId') userId: string) {
    return this.purchaseService.getUserPurchases(userId);
  }
} 