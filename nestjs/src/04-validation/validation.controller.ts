import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';

@Controller('validation')
export class ValidationController {
  @Post('orders')
  create(@Body() dto: CreateOrderDto) {
    // Echo back what we received plus its runtime type, to show what "quantity: number" really is.
    return { received: dto, quantityType: typeof dto.quantity };
  }
}
