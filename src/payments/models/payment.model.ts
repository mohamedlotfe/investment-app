import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Table({
  tableName: 'payments',
  timestamps: true,
})
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column(DataType.STRING)
  provider: string; // e.g., 'moyasar', 'stripe'

  @Column(DataType.DECIMAL(10, 2))
  amount: number;

  @Column(DataType.STRING)
  currency: string;

  @Column(DataType.STRING)
  status: 'pending' | 'completed' | 'failed';

  @Column(DataType.STRING)
  paymentId: string; // Provider-generated ID

  @Column(DataType.INTEGER)
  attempts: number;

  @ForeignKey(() => Transaction)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  transactionId: number;

  @BelongsTo(() => Transaction)
  transaction: Transaction;
}
