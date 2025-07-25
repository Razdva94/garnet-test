import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './../auth/auth.service';
import { User } from './user.entity';
import { ConditionalJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken: string;
  };
}

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ConditionalJwtAuthGuard)
  @Get('/getSelfInfo')
  async findByEmail(@Req() req: RequestWithCookies): Promise<User> {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.validateRefreshToken(refreshToken);
  }
}
