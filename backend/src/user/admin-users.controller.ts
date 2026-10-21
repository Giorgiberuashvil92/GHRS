import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { Purchase, PurchaseDocument } from '../schemas/purchase.schema';

@Controller('admin/users')
export class AdminUsersController {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(Purchase.name) private readonly purchases: Model<PurchaseDocument>,
  ) {}

  private userId(id: string) {
    if (!/^[a-f\d]{24}$/i.test(id)) throw new BadRequestException('Invalid user ID');
    return new Types.ObjectId(id);
  }

  @Get()
  async list(@Query('search') search = '', @Query('page') rawPage = '1') {
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) throw new BadRequestException('Invalid page');
    if (typeof search !== 'string') throw new BadRequestException('Invalid search');
    const escaped = search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = escaped ? { deletedAt: null, $or: [{ name: { $regex: escaped, $options: 'i' } }, { email: { $regex: escaped, $options: 'i' } }] } : { deletedAt: null };
    const [users, total] = await Promise.all([
      this.users.find(filter).select('_id name email phone location image createdAt fullAccess').sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 25).limit(25).lean(),
      this.users.countDocuments(filter),
    ]);
    const counts = await this.purchases.aggregate([
      { $match: { userId: { $in: users.map(user => user._id) } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countByUser = new Map(counts.map(row => [String(row._id), row.count]));
    return { users: users.map(user => ({ ...user, purchaseCount: countByUser.get(String(user._id)) || 0 })), total, page, pageSize: 25 };
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const user = await this.users.findOne({ _id: this.userId(id), deletedAt: null })
      .select('_id name email phone location image diseases additionalInfo fullAccess createdAt updatedAt statistics achievements').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const userId = this.userId(id);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Invalid user data');
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of ['name', 'email', 'phone', 'location']) {
      if (body[field] === undefined) continue;
      if (typeof body[field] !== 'string' || !(body[field] as string).trim() || (body[field] as string).length > 254) {
        throw new BadRequestException(`Invalid ${field}`);
      }
      updates[field] = (body[field] as string).trim();
    }
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email as string)) throw new BadRequestException('Invalid email address');
    for (const field of ['image', 'additionalInfo']) {
      if (body[field] === undefined) continue;
      if (typeof body[field] !== 'string' || (body[field] as string).length > (field === 'image' ? 2048 : 10000)) throw new BadRequestException(`Invalid ${field}`);
      updates[field] = (body[field] as string).trim();
    }
    if (updates.image && !/^https?:\/\//i.test(updates.image as string) && !(updates.image as string).startsWith('/')) throw new BadRequestException('Invalid image URL');
    if (body.diseases !== undefined) {
      if (!Array.isArray(body.diseases) || body.diseases.length > 100 || body.diseases.some(item => typeof item !== 'string' || item.length > 254)) throw new BadRequestException('Invalid diseases');
      updates.diseases = body.diseases.map(item => item.trim()).filter(Boolean);
    }
    if (body.fullAccess !== undefined) {
      if (typeof body.fullAccess !== 'boolean') throw new BadRequestException('Invalid access setting');
      updates.fullAccess = body.fullAccess;
    }
    try {
      const update = updates.email ? { $set: updates, $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 } } : { $set: updates };
      const result = await this.users.updateOne({ _id: userId, deletedAt: null }, update, { runValidators: true });
      if (!result.matchedCount) throw new NotFoundException('User not found');
    } catch (error) {
      if ((error as { code?: number }).code === 11000) throw new ConflictException('An account with this email already exists');
      throw error;
    }
    return this.detail(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.users.updateOne({ _id: this.userId(id), deletedAt: null }, {
      $set: { deletedAt: new Date(), updatedAt: new Date(), fullAccess: false },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
    });
    if (!result.matchedCount) throw new NotFoundException('User not found');
    return { success: true };
  }

  @Get(':id/purchases')
  async history(@Param('id') id: string) {
    const userId = this.userId(id);
    if (!await this.users.exists({ _id: userId, deletedAt: null })) throw new NotFoundException('User not found');
    const purchases = await this.purchases.find({ userId }).select('itemType setId courseId amount currency isActive expiresAt createdAt')
      .populate('setId', 'name title').populate('courseId', 'title').sort({ createdAt: -1 }).lean();
    return purchases.map(purchase => ({ ...purchase,
      hasAccess: purchase.isActive && (!purchase.expiresAt || new Date(purchase.expiresAt) > new Date()),
    }));
  }

  @Patch(':id/password')
  async changePassword(@Param('id') id: string, @Body() body: { password: string }) {
    const userId = this.userId(id);
    if (typeof body.password !== 'string' || body.password.length < 8 || Buffer.byteLength(body.password) > 72) {
      throw new BadRequestException('Use at least 8 characters and at most 72 bytes');
    }
    const password = await bcrypt.hash(body.password, 10);
    const result = await this.users.updateOne({ _id: userId, deletedAt: null }, {
      $set: { password, sessionIds: [], updatedAt: new Date() },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
    });
    if (!result.matchedCount) throw new NotFoundException('User not found');
    return { success: true };
  }
}
