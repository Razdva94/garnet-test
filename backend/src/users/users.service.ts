import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Поиск пользователя по email: ${email}`);
    return this.usersRepository.findByEmail(email);
  }

  async createUser(email: string, password: string): Promise<User> {
    this.logger.log(`Создание нового пользователя с email: ${email}`);
    return this.usersRepository.createUser(email, password);
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | undefined,
  ): Promise<void> {
    this.logger.verbose(
      `Обновление refresh-токена для пользователя с ID: ${id}`,
    );
    return this.usersRepository.updateRefreshToken(id, refreshToken);
  }

  async deleteRefreshToken(id: number): Promise<void> {
    this.logger.verbose(`Удаление refresh-токена для пользователя с ID: ${id}`);
    return this.usersRepository.deleteRefreshToken(id);
  }
}
