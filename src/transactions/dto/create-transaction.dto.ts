export class CreateTransactionDto {
  //amount: number;
  currency: string;
  userId: string;
  originalAmount: number;
  convertedAmount: number;
  roiPercentage: number;
  maturityDate: Date;
  status: string;
  paymentId?: string | null;
}
