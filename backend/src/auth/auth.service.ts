import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateRefreshToken(refreshToken: string): Promise<User> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const decoded = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: this.config.get('refresTokenSecret'),
    });

    if (!decoded.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.usersService.findByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(email: string, password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(email, hashedPassword);
    const tokens = this.generateTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('acessTokenSecret'),
      expiresIn: this.config.get('accessExpires'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('refresTokenSecret'),
      expiresIn: this.config.get('refreshExpires'),
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(email: string, refreshToken: string) {
    if (!email) {
      throw new BadRequestException('Email обязателен');
    }
    const user = await this.usersService.findByEmail(email);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Неверный refresh token');
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async handleLogout(userId: number) {
    await this.usersService.deleteRefreshToken(userId);
  }
}
