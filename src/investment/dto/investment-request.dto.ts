import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../common/constants/currency.constants';
import { ApiProperty } from '@nestjs/swagger';

export class InvestmentRequestDTO {
  @ApiProperty({
    example: 10000,
    description: 'Investment amount in base currency',
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: 'EUR',
    enum: SUPPORTED_CURRENCIES,
    description: 'Supported currencies for investment',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @ApiProperty({
    example: 12,
    description: 'Investment duration in months (1-60)',
    minimum: 1,
    maximum: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  durationMonths: number;

  @ApiProperty({
    example: 'MOYASAR',
    description: 'Optional payment provider override',
    enum: ['MOYASAR', 'STRIPE', 'PAYPAL'],
    required: false,
  })
  @IsOptional()
  @IsString()
  providerName?: string;
}
