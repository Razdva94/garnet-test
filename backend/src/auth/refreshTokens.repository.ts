import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refreshToken.entity';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly typeOrmRepository: Repository<RefreshToken>,
  ) {}

  async updateRefreshToken(
    userId: number,
    token: string | undefined,
  ): Promise<void> {
    if (token === null) {
      await this.typeOrmRepository.delete({ userId });
      return;
    }
    await this.typeOrmRepository.upsert({ userId, token }, ['userId']);
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    await this.typeOrmRepository.delete({ userId });
  }

  async createRefreshToken(userId: number, token: string): Promise<void> {
    const newToken = this.typeOrmRepository.create({ userId, token });
    await this.typeOrmRepository.save(newToken);
  }

  async findValidRefreshToken(
    userId: number,
    token: string,
  ): Promise<RefreshToken | null> {
    return this.typeOrmRepository.findOne({
      where: {
        userId,
        token,
      },
    });
  }
}
