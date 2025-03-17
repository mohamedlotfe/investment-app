import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyKycDto {
  @ApiProperty({ example: '123132165464' })
  @IsNotEmpty()
  @IsString()
  verificationDocument: string; // Could be ID number, passport, etc.

  @ApiProperty({ example: 'Egypt, Cairo-giza' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '01062968060' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
