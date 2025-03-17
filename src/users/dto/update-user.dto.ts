import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';

export class UpdateUserDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Password hash must be a string' })
  @IsOptional()
  passwordHash?: string;

  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  roles?: string[];

  @IsObject()
  @IsOptional()
  kycData?: any;
}
