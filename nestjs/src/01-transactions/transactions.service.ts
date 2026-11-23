import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order, Payment } from './entities';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
  ) {}

  // Looks like a Spring service method, but there is no @Transactional here.
  // The order is committed on its own, then the payment step fails.
  async placeOrderWithoutTransaction(productId: string) {
    const order = await this.orders.save({ productId });
    await this.failWhileSavingPayment(order.id);
  }

  // The Nest/TypeORM way: wrap the work in a transaction callback.
  // Every write must go through `manager`, the transaction-bound EntityManager.
  async placeOrderInTransaction(productId: string) {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const order = await manager.save(Order, { productId });
      await this.failWhileSavingPayment(order.id);
    });
  }

  async counts() {
    return { orders: await this.orders.count(), payments: await this.payments.count() };
  }

  private async failWhileSavingPayment(orderId: number): Promise<never> {
    throw new Error(`Payment for order ${orderId} failed`);
  }
}
