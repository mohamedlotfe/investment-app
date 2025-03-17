import { PaymentRequestDTO } from '../dto/payment-request.dto';
import { PaymentResponseDTO } from '../dto/payment-response.dto';

export interface PaymentProviderInterface {
  processPayment(paymentDto: PaymentRequestDTO): Promise<PaymentResponseDTO>;
  verifyPayment(paymentId: string): Promise<PaymentResponseDTO>;
  getName(): string;
}
