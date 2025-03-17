import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class KycDTO {
  @IsString()
  @IsNotEmpty({ message: 'Document type is required' })
  documentType: string;

  @IsString()
  @IsNotEmpty({ message: 'Document number is required' })
  documentNumber: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty({ message: 'Country of residence is required' })
  countryOfResidence: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
