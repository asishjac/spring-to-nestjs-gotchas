import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OrderModule } from '../src/02-modules/order.module';
import { OrderController } from '../src/02-modules/order.controller';
import { OrderService } from '../src/02-modules/order.service';
import { PaymentService } from '../src/02-modules/payment.service';

describe('02 modules: no component scanning', () => {
  it('works when PaymentModule exports PaymentService and OrderModule imports it', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [OrderModule] }).compile();
    const app = moduleRef.createNestApplication({ logger: false });
    await app.init();
    await request(app.getHttpServer()).get('/modules/checkout').expect(200, { result: 'charged 42' });
    await app.close();
  });

  it('fails at startup when PaymentService is not exported', async () => {
    // The "broken" variant: same as PaymentModule but without `exports`.
    @Module({ providers: [PaymentService] })
    class PaymentModuleWithoutExport {}

    @Module({
      imports: [PaymentModuleWithoutExport],
      controllers: [OrderController],
      providers: [OrderService],
    })
    class BrokenOrderModule {}

    await expect(
      Test.createTestingModule({ imports: [BrokenOrderModule] }).compile(),
    ).rejects.toThrow(/Nest can't resolve dependencies of the OrderService/);
  });
});
