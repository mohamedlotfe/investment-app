import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Decimal from 'decimal.js';
import { Transaction as TransactionOptions } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { EXCHANGE_RATES } from '../common/constants/currency.constants';
import { Payment } from '../payments/models/payment.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private readonly exchangeRates = EXCHANGE_RATES;

  constructor(
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction,
  ) {}
  create(
    createTransactionDto: CreateTransactionDto,
    options?: { transaction: TransactionOptions },
  ) {
    return this.transactionModel.create(
      createTransactionDto as Omit<
        Transaction,
        NullishPropertiesOf<Transaction>
      >,
      {
        transaction: options?.transaction,
      },
    );
  }

  findAll() {
    return `This action returns all transactions`;
  }

  update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    options: { transaction: TransactionOptions },
  ) {
    return this.transactionModel.update(updateTransactionDto, {
      where: { id },
      returning: true,
      transaction: options.transaction,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
  convertCurrency(amount: Decimal, currency: string): Decimal {
    const rate = this.exchangeRates[currency] as number;
    if (!rate) throw new Error('Unsupported currency');
    return new Decimal(amount).mul(rate);
  }

  calculateROI(convertedAmount: Decimal): Decimal {
    const annualRate = 0.1; // 10% fixed annual return
    return convertedAmount
      .mul(annualRate)
      .div(convertedAmount)
      .mul(100)
      .toDecimalPlaces(2);
  }
  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionModel.findByPk(id, {
      include: [Payment],
    });
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
