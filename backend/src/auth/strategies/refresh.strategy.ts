import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken: string;
  };
}
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies): string | null => {
          const token = req?.cookies?.refreshToken;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: `${config.get<string>('refresTokenSecret')}`,
      ignoreExpiration: false,
    });
  }

  validate(payload: IJwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
