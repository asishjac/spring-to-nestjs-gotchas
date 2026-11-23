import { Injectable } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Injectable()
export class OrderService {
  constructor(private readonly payments: PaymentService) {}

  checkout() {
    return { result: this.payments.charge(42) };
  }
}
