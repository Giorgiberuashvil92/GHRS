import { AdminUsersController } from './admin-users.controller';
import { Purchase, PurchaseSchema } from '../schemas/purchase.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserInstructorController, UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Purchase.name, schema: PurchaseSchema }]),
  ],
  controllers: [UserInstructorController, UserController, AdminUsersController],
  exports: [MongooseModule],
})
export class UserModule {}
