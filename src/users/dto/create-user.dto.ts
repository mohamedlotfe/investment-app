import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password hash must be a string' })
  passwordHash: string;

  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean = false;

  @IsOptional()
  roles?: string[] = ['user'];

  @IsObject()
  @IsOptional()
  kycData?: any;
}
