import { forwardRef, Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { AuthModule } from '../auth/auth.module';
import { ContactRepository } from './contacts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), forwardRef(() => AuthModule)],
  controllers: [ContactsController],
  providers: [ContactsService, ContactRepository],
  exports: [ContactsService],
})
export class ContactsModule {}

