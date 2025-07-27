import { Repository } from 'typeorm';
import { Contact } from './contacts.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async createContact(createContactDto: CreateContactDto): Promise<Contact> {
    const { name, phone, email, tags, lastInteraction } = createContactDto;
    const contacts = this.contactRepository.create({
      name,
      phone,
      email,
      tags,
      lastInteraction,
    });
    return this.contactRepository.save(contacts);
  }

  async findById(id: number): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { id } });
  }

  async updateContact(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact | null> {
    await this.contactRepository.update(id, updateContactDto);
    return this.findById(id);
  }
  async getAllContacts(): Promise<Contact[]> {
    return this.contactRepository
      .createQueryBuilder('contact')
      .orderBy('contact.name', 'DESC')
      .getMany();
  }

  async deleteContact(id: number) {
    await this.contactRepository.delete(id);
  }
}
