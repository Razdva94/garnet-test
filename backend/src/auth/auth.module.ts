import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refreshToken.entity';
import { RefreshTokensRepository } from './refreshTokens.repository';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ContactsModule),
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule,
    JwtModule.register({}),
    PassportModule.register({}),
  ],
  providers: [
    RefreshTokensRepository,
    AuthService,
    JwtStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
