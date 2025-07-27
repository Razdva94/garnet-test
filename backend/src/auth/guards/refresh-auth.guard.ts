import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

interface IUser {
  userId: number;
  email: string;
}

@Injectable()
export class ConditionalRefreshAuthGuard extends AuthGuard('refresh') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const enabled = this.configService.get<boolean>('auth');
    return enabled ? super.canActivate(context) : true;
  }

  handleRequest<TUser = IUser>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid refresh token');
    }
    return user as TUser;
  }
}
