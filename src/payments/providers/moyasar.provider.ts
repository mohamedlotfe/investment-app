import { Injectable, Logger } from '@nestjs/common';
import { PaymentProviderInterface } from '../interfaces/payment-provider.interface';
import { PaymentRequestDTO } from '../dto/payment-request.dto';
import { PaymentResponseDTO } from '../dto/payment-response.dto';
import { ConfigService } from '@nestjs/config';
import { Decimal } from 'decimal.js';
import { HashUtil } from '../../common/utils/hash.util';

@Injectable()
export class MoyasarProvider implements PaymentProviderInterface {
  private readonly logger = new Logger(MoyasarProvider.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    // In a real application, you would get this from environment variables
    this.apiKey = this.configService.get<string>(
      'MOYASAR_API_KEY',
      'test_api_key',
    );
  }

  getName(): string {
    return 'MOYASAR';
  }

  async processPayment(
    paymentDto: PaymentRequestDTO,
  ): Promise<PaymentResponseDTO> {
    this.logger.log(
      `Processing payment via Moyasar for user ${HashUtil.hashSensitiveData(paymentDto.userId)}`,
    );

    try {
      // In a real implementation, you would make an HTTP request to Moyasar's API
      // For this example, we'll simulate the API call

      // Convert amount to the smallest currency unit (e.g., cents for USD)
      const amount = new Decimal(paymentDto.amount).mul(100).toFixed(0);

      // Simulate API call
      await this.simulateApiCall();

      // Simulate success (80% chance)
      if (Math.random() <= 0.8) {
        const paymentId = `MSR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        return {
          paymentId,
          status: 'COMPLETED',
          amount: amount,
          currency: paymentDto.currency,
          timestamp: new Date().toISOString(),
          provider: this.getName(),
          providerReference: `moyasar_${paymentId}`,
        };
      } else {
        throw new Error('Payment declined by Moyasar');
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Moyasar payment error: ${error.message}`);
      } else {
        this.logger.error('Moyasar payment error: Unknown error');
      }
      throw error;
    }
  }

  async verifyPayment(paymentId: string): Promise<PaymentResponseDTO> {
    this.logger.log(`Verifying Moyasar payment: ${paymentId}`);

    try {
      // In a real implementation, you would make an HTTP request to Moyasar's API
      // For this example, we'll simulate the API call
      await this.simulateApiCall();

      // For demo purposes, we'll simulate a successful verification
      return {
        paymentId,
        status: 'COMPLETED',
        amount: '0', // In a real implementation, this would come from the API response
        currency: 'USD', // In a real implementation, this would come from the API response
        timestamp: new Date().toISOString(),
        provider: this.getName(),
        providerReference: `moyasar_${paymentId}`,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Moyasar verification error: ${error.message}`);
      } else {
        this.logger.error('Moyasar verification error: Unknown error');
      }
      throw error;
    }
  }

  private async simulateApiCall(): Promise<void> {
    // Simulate network latency
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 700),
    );
  }
}
