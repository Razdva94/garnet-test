import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Inject,
  Logger,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from 'src/users/user.entity';
import { ConditionalRefreshAuthGuard } from './guards/refresh-auth.guard';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConditionalJwtAuthGuard } from './guards/jwt-auth.guard';

interface CustomRequest extends Request {
  user: { userId: number; email: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken } = await this.authService.login(
      email,
      password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.config.get('nodeEnv') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return { accessToken, refreshToken };
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @UseGuards(ConditionalRefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!this.config.get('auth') === false) {
      const userEmail = req.user.email;
      const oldRefreshToken = req.cookies.refreshToken;

      const { refreshToken, accessToken } =
        await this.authService.refreshTokens(userEmail, oldRefreshToken);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.config.get('nodeEnv') === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return { refreshToken, accessToken };
    } else {
      this.logger?.debug('Пропуск рефреша');
    }
  }

  @UseGuards(ConditionalJwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req?.user?.userId;
    await this.authService.handleLogout(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.config.get('nodeEnv') === 'production',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
