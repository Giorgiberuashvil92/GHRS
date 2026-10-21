import { User, UserDocument } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from '../schemas/purchase.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPurchase(data: {
    userId: string;
    setId?: string;
    courseId?: string;
    paymentId: string;
    amount: number;
    currency: string;
    itemType?: 'set' | 'course';
  }) {
    const purchaseData: any = {
      userId: new Types.ObjectId(data.userId),
      paymentId: data.paymentId,
      amount: data.amount,
      currency: data.currency,
      itemType: data.itemType || 'set',
    };

    if (data.setId) {
      purchaseData.setId = new Types.ObjectId(data.setId);
    }

    if (data.courseId) {
      purchaseData.courseId = new Types.ObjectId(data.courseId);
    }

    const purchase = new this.purchaseModel(purchaseData);
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
      .populate('courseId')
      .exec();
      
    return purchases;
  }

  async checkUserAccess(userId: string, setId: string): Promise<boolean> {
    console.log('🔍 checkUserAccess called with:', { userId, setId });
    
    // Validate ObjectIds
    if (!Types.ObjectId.isValid(userId)) {
      console.error('❌ Invalid userId:', userId);
      return false;
    }
    
    if (!Types.ObjectId.isValid(setId)) {
      console.error('❌ Invalid setId:', setId);
      return false;
    }
    
    try {
      const user = await this.userModel.findOne({ _id: userId, deletedAt: null }).select('fullAccess');
      if (!user) return false;
      if (user.fullAccess) return true;
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
    } catch (error) {
      console.error('❌ Error in checkUserAccess:', error);
      return false;
    }
  }

  async checkUserCourseAccess(userId: string, courseId: string): Promise<boolean> {
    console.log('🔍 checkUserCourseAccess called with:', { userId, courseId });
    
    // Validate ObjectIds
    if (!Types.ObjectId.isValid(userId)) {
      console.error('❌ Invalid userId:', userId);
      return false;
    }
    
    if (!Types.ObjectId.isValid(courseId)) {
      console.error('❌ Invalid courseId:', courseId);
      return false;
    }
    
    try {
      const user = await this.userModel.findOne({ _id: userId, deletedAt: null }).select('fullAccess');
      if (!user) return false;
      if (user.fullAccess) return true;
      const purchase = await this.purchaseModel.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        isActive: true,
      });
      
      console.log('📦 Found course purchase for access check:', purchase ? 'YES' : 'NO');
      if (purchase) {
        console.log('📋 Course purchase details:', JSON.stringify(purchase, null, 2));
      }
      
      if (!purchase) return false;

      // Check if expired
      if (purchase.expiresAt && purchase.expiresAt < new Date()) {
        purchase.isActive = false;
        await purchase.save();
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error in checkUserCourseAccess:', error);
      return false;
    }
  }
} 