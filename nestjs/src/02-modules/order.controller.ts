import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('modules')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Get('checkout')
  checkout() {
    return this.orders.checkout();
  }
}
