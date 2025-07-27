import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { ExtendedLoggerService } from 'src/auth/interfaces/logger.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: ExtendedLoggerService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Поиск пользователя по email: ${email}`);
    return this.usersRepository.findByEmail(email);
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    this.logger.debug(
      `Создание нового пользователя с email: ${email}; name: ${name}`,
    );
    return this.usersRepository.createUser(name, email, password);
  }
}
