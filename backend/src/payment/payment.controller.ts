import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() body: { amount: number; currency: string }) {
    return this.paymentService.createOrder(body.amount, body.currency);
  }

  @Post('capture-payment')
  async capturePayment(@Body() body: { orderId: string }) {
    return this.paymentService.capturePayment(body.orderId);
  }
} 