import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentModule } from './payment.module';

@Module({
  // Remove PaymentModule from imports and startup fails the same way as a missing export.
  imports: [PaymentModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
