export class TransactionResponseDTO {
  transactionId: string;
  userId: string;
  originalAmount: string;
  currency: string;
  convertedAmount: string;
  roiPercentage: string;
  projectedValue?: string;
  maturityDate: string;
  status: string;
  paymentId: string;
}
