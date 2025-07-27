import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from './refreshTokens.repository';
import { ExtendedLoggerService } from './interfaces/logger.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: ExtendedLoggerService,
  ) {}

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
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string | undefined,
  ): Promise<void> {
    this.logger.verbose(
      `Обновление refresh-токена для пользователя с ID: ${userId}`,
    );

    return this.refreshTokensRepository.updateRefreshToken(
      userId,
      refreshToken,
    );
  }

  async register(name: string, email: string, password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(
      name,
      email,
      hashedPassword,
    );
    const tokens = this.generateTokens(user.id, user.email);
    await this.refreshTokensRepository.createRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens;
  }

  generateTokens(userId: number, email: string) {
    const payload = { userId, email };
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

  async refreshTokens(email: string) {
    if (!email) {
      throw new BadRequestException('Email обязателен');
    }
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Неверный refresh token');
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async handleLogout(userId: number) {
    await this.deleteRefreshToken(userId);
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    this.logger.verbose(
      `Удаление refresh-токена для пользователя с ID: ${userId}`,
    );
    return this.refreshTokensRepository.deleteRefreshToken(userId);
  }
}
