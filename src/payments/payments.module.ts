import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { PaymentProviderFactory } from './payment-provider.factory';
import { MoyasarProvider } from './providers/moyasar.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([Payment])],

  controllers: [PaymentController],
  providers: [PaymentService, PaymentProviderFactory, MoyasarProvider],
  exports: [PaymentService],
})
export class PaymentsModule {}
