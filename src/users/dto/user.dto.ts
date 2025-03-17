import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UserDTO {
  @IsUUID()
  @Expose()
  id: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsBoolean()
  @Expose()
  isVerified: boolean;

  @IsOptional()
  @Expose()
  roles?: string[];

  @IsOptional()
  @Expose()
  kycData?: any;

  // Exclude password hash from responses
  @Exclude()
  passwordHash: string;
}
