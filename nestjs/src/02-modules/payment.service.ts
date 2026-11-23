import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  charge(amount: number) {
    return `charged ${amount}`;
  }
}
