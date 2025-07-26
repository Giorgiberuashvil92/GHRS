import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  imports: [
    ConfigModule,
    PurchaseModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {} 