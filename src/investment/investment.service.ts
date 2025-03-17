import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { Sequelize } from 'sequelize-typescript';
import { HashUtil } from '../common/utils/hash.util';
import { PaymentService } from '../payments/payments.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { InvestmentRequestDTO } from './dto/investment-request.dto';
import { TransactionResponseDTO } from './dto/transaction-response.dto';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name);

  constructor(
    private readonly transactionService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly paymentService: PaymentService,
    private readonly sequelize: Sequelize,
  ) {}

  async processInvestment(
    userId: string,
    investmentDto: InvestmentRequestDTO,
  ): Promise<TransactionResponseDTO> {
    this.validateInvestment(investmentDto);

    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn(`User not found: ${HashUtil.hashSensitiveData(userId)}`);
      throw new BadRequestException('User not found');
    }

    if (!user.isVerified) {
      this.logger.warn(
        `Unverified user attempt: ${HashUtil.hashSensitiveData(userId)}`,
      );
      throw new BadRequestException('User verification required');
    }

    const transaction = await this.sequelize.transaction(async (t) => {
      const amount = new Decimal(investmentDto.amount);
      const convertedAmount = this.transactionService.convertCurrency(
        amount,
        investmentDto.currency,
      );
      const roiPercentage =
        this.transactionService.calculateROI(convertedAmount);

      const maturityDate = new Date();
      maturityDate.setMonth(
        maturityDate.getMonth() + investmentDto.durationMonths,
      );

      const investmentTrx = await this.transactionService.create(
        {
          userId,
          originalAmount: amount.toNumber(),
          currency: investmentDto.currency,
          convertedAmount: convertedAmount.toNumber(),
          roiPercentage: roiPercentage.toNumber(),
          maturityDate,
          status: 'PENDING',
        },
        { transaction: t },
      );

      try {
        const paymentResult = await this.paymentService.processPayment({
          userId, // Send real ID to payment service
          amount: amount.toNumber(),
          currency: investmentDto.currency,
          providerName: investmentDto.providerName || 'MOYASAR',
        });

        //investmentTrx.payment = paymentResult;
        // Create a Payment record associated with the transaction
        const payment = await this.paymentService.create(
          {
            transactionId: Number(investmentTrx.id),
            provider: paymentResult.provider,
            amount: Number(paymentResult.amount),
            currency: paymentResult.currency,
            status: paymentResult.status,
            paymentId: paymentResult.paymentId,
            providerReference: paymentResult.providerReference,
            attempts: 1, // or whatever logic you need
          },
          { transaction: t },
        );
        await investmentTrx.$set('payment', payment, { transaction: t });

        investmentTrx.status =
          paymentResult.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING';

        await this.transactionService.update(investmentTrx.id, investmentTrx, {
          transaction: t,
        });
        return investmentTrx.toJSON();
      } catch (error) {
        await this.transactionService.update(
          investmentTrx.id,
          { status: 'FAILED' },
          { transaction: t },
        );
        throw error;
      }
    });

    this.logger.log(
      `Processed investment ${HashUtil.hashSensitiveData(transaction.id.toString())} - Status: ${transaction.status}`,
    );

    return this.mapToResponseDto(transaction);
  }

  private validateInvestment(dto: InvestmentRequestDTO): void {
    if (!dto.currency.match(/^[A-Z]{3}$/)) {
      throw new BadRequestException('Invalid currency format');
    }

    const amount = new Decimal(dto.amount);
    if (amount.lte(0) || !amount.isFinite()) {
      throw new BadRequestException('Invalid investment amount');
    }
  }

  private mapToResponseDto(transaction: Transaction): TransactionResponseDTO {
    const projectedValue = new Decimal(transaction.convertedAmount)
      .mul(new Decimal(1).plus(new Decimal(transaction.roiPercentage).div(100)))
      .toFixed(2);

    return {
      transactionId: transaction.id,
      userId: HashUtil.hashSensitiveData(transaction.userId),
      originalAmount: transaction.originalAmount.toString(),
      currency: transaction.currency,
      convertedAmount: transaction.convertedAmount.toString(),
      roiPercentage: new Decimal(transaction.roiPercentage).toFixed(2),
      projectedValue,
      maturityDate: transaction.maturityDate.toISOString().split('T')[0],
      status: transaction.status,
      paymentId: transaction.payment.id.toString(),
    };
  }
}
