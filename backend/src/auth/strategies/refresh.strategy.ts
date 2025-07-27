import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from '../refreshTokens.repository';
import { UsersService } from 'src/users/users.service';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken: string;
  };
}
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    config: ConfigService,
    private refreshTokenRepository: RefreshTokensRepository,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies): string | null => {
          const token = req?.cookies?.refreshToken;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: `${config.get<string>('refresTokenSecret')}`,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: RequestWithCookies, payload: IJwtPayload) {
    if (!payload?.userId || !payload?.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const tokenFromDb = await this.refreshTokenRepository.findValidRefreshToken(
      payload.userId,
      req.cookies.refreshToken,
    );

    if (!tokenFromDb) {
      throw new UnauthorizedException('Token revoked');
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: payload.userId, email: payload.email };
  }
}
