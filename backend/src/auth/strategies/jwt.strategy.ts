import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, @InjectModel(User.name) private users: Model<UserDocument>) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (typeof payload.sub !== 'string' || !Types.ObjectId.isValid(payload.sub)) throw new UnauthorizedException();
    const user = await this.users.findOne({ _id: payload.sub, deletedAt: null }).select('email +sessionIds');
    if (!user) throw new UnauthorizedException();
    if (payload.sid !== undefined && (typeof payload.sid !== 'string' || !user.sessionIds?.includes(payload.sid))) throw new UnauthorizedException();
    // Only unexpired legacy tokens may omit a server-managed session.
    if (!payload.sid && typeof payload.exp !== 'number') throw new UnauthorizedException();
    return { userId: payload.sub, email: user.email, sessionId: payload.sid };
  }
}
