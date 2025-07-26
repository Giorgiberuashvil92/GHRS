import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPurchase(
    @Req() req: any,
    @Body() data: {
      setId: string;
      paymentId: string;
      amount: number;
      currency: string;
    },
  ) {
    return this.purchaseService.createPurchase({
      userId: req.user.id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyPurchases(@Req() req: any) {
    return this.purchaseService.getUserPurchases(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-access')
  async checkAccess(
    @Req() req: any,
    @Body() data: { setId: string },
  ) {
    return this.purchaseService.checkUserAccess(req.user.id, data.setId);
  }
} 