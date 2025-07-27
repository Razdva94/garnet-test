import { UsersService } from './users.service';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ConditionalJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { User } from './user.entity';

interface CustomRequest extends Request {
  user: { userId: number; email: string };
}
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @UseGuards(ConditionalJwtAuthGuard)
  @Get('/getSelfInfo')
  async findByEmail(@Req() req: CustomRequest): Promise<User | null> {
    const userEmail = req.user.email;
    return this.UsersService.findByEmail(userEmail);
  }
}
