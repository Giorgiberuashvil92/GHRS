import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(
    @Body() data: { 
      amount: number; 
      currency: string; 
      userId: string; 
      itemId: string; 
      itemType?: 'set' | 'course' | 'mixed';
    },
  ) {
    return this.paymentService.createOrder(
      data.amount,
      data.currency,
      data.userId,
      data.itemId,
      data.itemType || 'set',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('capture-payment')
  async capturePayment(@Body() data: { orderId: string }) {
    return this.paymentService.capturePayment(data.orderId);
  }
} 