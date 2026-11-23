import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService],
  // Without this line, PaymentService is private to PaymentModule.
  // Comment it out and `npm run start:dev` fails at startup with:
  //   Nest can't resolve dependencies of the OrderService (?).
  //   Please make sure that the argument PaymentService at index [0]
  //   is available in the OrderModule module.
  exports: [PaymentService],
})
export class PaymentModule {}
