import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/models/user.model';
import { InvestmentRequestDTO } from './dto/investment-request.dto';
import { TransactionResponseDTO } from './dto/transaction-response.dto';
import { InvestmentService } from './investment.service';

@ApiTags('Investments')
@ApiBearerAuth('access-token')
@Controller('invest')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Initiate investment transaction',
    description:
      'Creates a new investment with currency conversion and payment processing',
  })
  @ApiBody({
    type: InvestmentRequestDTO,
    examples: {
      example1: {
        value: {
          amount: 10000,
          currency: 'EUR',
          durationMonths: 12,
          providerName: 'MOYASAR',
        },
        description: 'Standard investment request',
      },
      example2: {
        value: {
          amount: 5000,
          currency: 'GBP',
          durationMonths: 6,
        },
        description: 'Minimal request (uses default provider)',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful investment response',
    type: TransactionResponseDTO,
    examples: {
      example1: {
        summary: 'Successful investment transaction example',
        value: {
          transactionId: 'TRX-12345',
          convertedAmount: '10800.00',
          roiPercentage: '10.00',
          paymentStatus: 'COMPLETED',
          paymentId: 'MSR-1717047200000-1234',
          maturityDate: '2025-06-01',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['currency must be one of USD, EUR, GBP'],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid authentication token',
  })
  async invest(
    @Body() input: InvestmentRequestDTO,
    @CurrentUser() user: User,
  ): Promise<TransactionResponseDTO> {
    return this.investmentService.processInvestment(user.id, input);
  }
}
