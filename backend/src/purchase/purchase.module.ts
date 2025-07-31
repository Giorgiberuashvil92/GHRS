import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { Purchase, PurchaseSchema } from '../schemas/purchase.schema';
import { Set, SetSchema } from '../schemas/set.schema';
import { Course, CourseSchema } from '../schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: 'sets', schema: SetSchema },
      { name: Course.name, schema: CourseSchema }
    ])
  ],  
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {} 