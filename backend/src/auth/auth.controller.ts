import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Inject,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from 'src/users/user.entity';
import { ConditionalRefreshAuthGuard } from './guards/refresh-auth.guard';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConditionalJwtAuthGuard } from './guards/jwt-auth.guard';
import { ExtendedLoggerService } from './interfaces/logger.interface';

interface CustomRequest extends Request {
  user: { userId: number; email: string };
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: ExtendedLoggerService,
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

  @Get('check')
  @UseGuards(ConditionalRefreshAuthGuard)
  async checkAuth(@Req() req: CustomRequest, @Res() res: Response) {
    const user = req.user;
    const accessToken = this.authService.generateTokens(
      user.userId,
      user.email,
    ).accessToken;

    return res.json({
      user,
      accessToken,
    });
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.authService.register(name, email, password);
  }

  @UseGuards(ConditionalRefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!this.config.get('auth') === false) {
      const userEmail = req.user.email;

      const { refreshToken, accessToken } =
        await this.authService.refreshTokens(userEmail);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.config.get('nodeEnv') === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return { refreshToken, accessToken };
    } else {
      this.logger.debug('Пропуск рефреша');
    }
  }

  @Post('logout')
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
