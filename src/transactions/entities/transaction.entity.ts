import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Payment } from '../../payments/models/payment.model';

@Table({ tableName: 'transactions', timestamps: true })
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  originalAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  convertedAmount: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  roiPercentage: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  maturityDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID, // Ensure this matches the type defined on User
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasOne(() => Payment)
  payment: Payment;
}
