export class PaymentResponseDTO {
  paymentId: string;
  status: string;
  amount: string;
  currency: string;
  timestamp: string;
  provider: string;
  providerReference?: string;
}
