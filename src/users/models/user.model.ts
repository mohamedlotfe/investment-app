import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: ['user'],
  })
  roles: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  kycData: any;

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLogin: Date;

  @BeforeCreate
  static validateEmail(instance: User) {
    instance.email = instance?.email?.toLowerCase();
  }
}
