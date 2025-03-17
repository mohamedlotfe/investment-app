import { Injectable, Logger } from '@nestjs/common';
import { PaymentRequestDTO } from './dto/payment-request.dto';
import { PaymentResponseDTO } from './dto/payment-response.dto';
import { HashUtil } from '../common/utils/hash.util';
import { PaymentProviderFactory } from './payment-provider.factory';
import { ConfigService } from '@nestjs/config';
import { Payment } from './models/payment.model';
import { InjectModel } from '@nestjs/sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { CreatePaymentDto } from './dto/create-payment-input.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly defaultProvider: string;

  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly configService: ConfigService,
  ) {
    // Get the default provider from config (fallback to MOYASAR)
    this.defaultProvider = this.configService.get<string>(
      'DEFAULT_PAYMENT_PROVIDER',
      'MOYASAR',
    );
  }
  async create(
    createPaymentDto: CreatePaymentDto,
    options?: { transaction?: any },
  ): Promise<Payment> {
    this.logger.log('Creating Payment record...');
    const paymentRecord = await this.paymentModel.create(
      createPaymentDto as Omit<Payment, NullishPropertiesOf<Payment>>,
      options,
    );
    this.logger.log(`Payment record created with id ${paymentRecord.id}`);
    return paymentRecord;
  }
  async processPayment(
    paymentDto: PaymentRequestDTO,
  ): Promise<PaymentResponseDTO> {
    const provider = this.paymentProviderFactory.getProvider(
      paymentDto.providerName || this.defaultProvider,
    );
    const maxRetries = 3;
    let attempt = 0;
    let backoffTime = 1000; // 1 second initial backoff

    while (attempt < maxRetries) {
      try {
        const hashedUserId = HashUtil.hashSensitiveData(paymentDto.userId);
        this.logger.log(
          `Payment attempt ${attempt + 1} for user ${hashedUserId} using provider ${provider.getName()}`,
        );

        // Process payment with the selected provider
        const paymentResult = await provider.processPayment(paymentDto);

        this.logger.log(
          `Payment processed successfully: ${paymentResult.paymentId} via ${provider.getName()}`,
        );

        return paymentResult;
      } catch {
        attempt++;

        if (attempt >= maxRetries) {
          this.logger.error(
            `Payment failed after ${maxRetries} attempts with provider ${provider.getName()}`,
          );
          throw new Error('Payment processing failed after multiple attempts');
        }

        this.logger.warn(
          `Payment attempt ${attempt} failed, retrying in ${backoffTime}ms`,
        );

        // Wait with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, backoffTime));

        // Exponential backoff: double the wait time for the next attempt
        backoffTime *= 2;
      }
    }

    // Add a fallback return or throw to ensure all code paths are covered
    throw new Error(
      'Unexpected error: processPayment exited without returning a result',
    );
  }

  async verifyPayment(
    paymentId: string,
    providerName?: string,
  ): Promise<PaymentResponseDTO> {
    const provider = this.paymentProviderFactory.getProvider(
      providerName || this.defaultProvider,
    );

    try {
      this.logger.log(
        `Verifying payment ${paymentId} with provider ${provider.getName()}`,
      );
      return await provider.verifyPayment(paymentId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Payment verification failed: ${error.message}`);
      } else {
        this.logger.error('Payment verification failed with an unknown error');
      }
      throw error;
    }
  }
}
