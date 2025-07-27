import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ExtendedLoggerService } from 'src/auth/interfaces/logger.interface';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ConditionalJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('/contacts')
export class ContactsController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: ExtendedLoggerService,
    private readonly contactsService: ContactsService,
  ) {}
  @UseGuards(ConditionalJwtAuthGuard)
  @Get()
  async get() {
    const allContacts = await this.contactsService.get();
    return allContacts;
  }
  @UseGuards(ConditionalJwtAuthGuard)
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const createdContact = await this.contactsService.create(createContactDto);
    return createdContact;
  }

  @UseGuards(ConditionalJwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateContactDto: UpdateContactDto,
  ) {
    const updateContact = await this.contactsService.update(
      id,
      UpdateContactDto,
    );
    return updateContact;
  }

  @UseGuards(ConditionalJwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedContact = await this.contactsService.delete(id);
    return deletedContact;
  }
}
