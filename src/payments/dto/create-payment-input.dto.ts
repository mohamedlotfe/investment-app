export class CreatePaymentDto {
  transactionId: number;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  paymentId: string;
  providerReference?: string;
  attempts?: number;
}
