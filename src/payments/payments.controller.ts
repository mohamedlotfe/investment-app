import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payments.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentRequestDTO } from './dto/payment-request.dto';
import { PaymentResponseDTO } from './dto/payment-response.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
    type: PaymentResponseDTO,
  })
  async processPayment(
    @Body() paymentDto: PaymentRequestDTO,
  ): Promise<PaymentResponseDTO> {
    return this.paymentService.processPayment(paymentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify payment status' })
  async verifyPayment(
    @Param('id') paymentId: string,
  ): Promise<PaymentResponseDTO> {
    return this.paymentService.verifyPayment(paymentId);
  }
}
