import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  async getUserPurchases(@Request() req) {
    return this.purchaseService.getUserPurchases(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-access/:setId')
  async checkAccess(@Request() req, @Param('setId') setId: string) {
    return this.purchaseService.checkUserAccess(req.user.id, setId);
  }
} 