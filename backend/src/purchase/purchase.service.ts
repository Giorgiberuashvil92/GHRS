import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from '../schemas/purchase.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
  ) {}

  async createPurchase(data: {
    userId: string;
    setId: string;
    paymentId: string;
    amount: number;
    currency: string;
  }) {
    const purchase = new this.purchaseModel({
      userId: new Types.ObjectId(data.userId),
      setId: new Types.ObjectId(data.setId),
      paymentId: data.paymentId,
      amount: data.amount,
      currency: data.currency,
    });
    return purchase.save();
  }

  async getUserPurchases(userId: string) {
    if (!userId) {
      return [];
    }
    
    const purchases = await this.purchaseModel
      .find({ 
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .populate('setId')
      .exec();
      
    return purchases;
  }

  async checkUserAccess(userId: string, setId: string): Promise<boolean> {
    console.log('🔍 checkUserAccess called with:', { userId, setId });
    
    const purchase = await this.purchaseModel.findOne({
      userId: new Types.ObjectId(userId),
      setId: new Types.ObjectId(setId),
      isActive: true,
    });
    
    console.log('📦 Found purchase for access check:', purchase ? 'YES' : 'NO');
    if (purchase) {
      console.log('📋 Purchase details:', JSON.stringify(purchase, null, 2));
    }
    
    if (!purchase) return false;

    // თუ არის expiresAt და გასულია ვადა
    if (purchase.expiresAt && purchase.expiresAt < new Date()) {
      purchase.isActive = false;
      await purchase.save();
      return false;
    }

    return true;
  }
} 