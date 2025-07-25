import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConditionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authEnabled = this.configService.get<boolean>('auth');
    if (!authEnabled) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    const authEnabled = this.configService.get<boolean>('auth');

    if (!authEnabled) {
      return true;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
