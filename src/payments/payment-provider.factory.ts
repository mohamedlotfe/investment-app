import { Injectable } from '@nestjs/common';
import { MoyasarProvider } from './providers/moyasar.provider';

import { PaymentProviderInterface } from './interfaces/payment-provider.interface';

@Injectable()
export class PaymentProviderFactory {
  constructor(private readonly moyasarProvider: MoyasarProvider) {}

  getProvider(providerName?: string): PaymentProviderInterface {
    switch (providerName?.toUpperCase()) {
      case 'STRIPE':
        throw new Error('Stripe not implemented yet');
      case 'PAYPAL':
        throw new Error('PayPal not implemented yet');
      case 'MOYASAR':
      default:
        return this.moyasarProvider; // Default to Moyasar
    }
  }
}
