import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConditionalRefreshAuthGuard extends AuthGuard('refresh') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const enabled = this.configService.get<boolean>('auth');
    return enabled ? super.canActivate(context) : true;
  }

  handleRequest(err: any, user: any) {
    if (!this.configService.get<boolean>('auth')) {
      return true;
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
