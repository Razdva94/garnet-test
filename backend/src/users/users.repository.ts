import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | undefined,
  ): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.userRepository.update({ id }, { refreshToken: null });
  }
}
