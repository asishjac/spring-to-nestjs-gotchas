import { Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  // Both endpoints return 500 because the payment step throws. What differs is what's left in the DB.
  @Post('without/:productId')
  without(@Param('productId') productId: string) {
    return this.service.placeOrderWithoutTransaction(productId);
  }

  @Post('with/:productId')
  with(@Param('productId') productId: string) {
    return this.service.placeOrderInTransaction(productId);
  }

  @Get('counts')
  counts() {
    return this.service.counts();
  }
}
