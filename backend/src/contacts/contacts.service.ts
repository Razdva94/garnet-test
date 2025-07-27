import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ExtendedLoggerService } from 'src/auth/interfaces/logger.interface';
import { ContactRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './contacts.entity';

@Injectable()
export class ContactsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: ExtendedLoggerService,
    private readonly contactRepository: ContactRepository,
  ) {}

  async get() {
    this.logger.log(`Getting all contacts`);
    return this.contactRepository.getAllContacts();
  }
  async create(createContactDto: CreateContactDto) {
    this.logger.log(`Creating contact name: ${createContactDto.name}`);
    return this.contactRepository.createContact(createContactDto);
  }
  async update(id: number, updateContactDto: UpdateContactDto) {
    if (Object.keys(updateContactDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }

    const existingContact = await this.contactRepository.findById(id);
    if (!existingContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    this.logger.log(`Updating contact ${id}`);
    return this.contactRepository.updateContact(Number(id), updateContactDto);
  }

  async delete(id: string) {
    const existingContact = await this.contactRepository.findById(Number(id));
    if (!existingContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    this.logger.log(`Deleting contact ${id}`);
    return this.contactRepository.deleteContact(Number(id));
  }
}
