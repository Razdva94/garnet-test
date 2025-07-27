import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  InvalidTokenError,
  TokenExpiredError,
} from '../../exceptions/auth.errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${config.get<string>('acessTokenSecret')}`,
      ignoreExpiration: true,
    });
  }

  validate(payload: IJwtPayload) {
    const currentTime = Math.floor(Date.now() / 1000);
    this.logger.debug({
      message: 'JWT payload validated',
      userId: payload.userId,
      userEmail: payload.email,
      issuedAt: new Date(payload.iat * 1000).toISOString(),
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      currentTime: new Date(currentTime * 1000).toISOString(),
    });

    if (!payload.userId || !payload.email) {
      this.logger.warn('Invalid token payload');
      throw new InvalidTokenError();
    }

    if (payload.exp < currentTime) {
      this.logger.warn('Token expired');
      throw new TokenExpiredError();
    }
    return { userId: payload.userId, email: payload.email };
  }
}
