import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  lastInteraction?: Date;
}
