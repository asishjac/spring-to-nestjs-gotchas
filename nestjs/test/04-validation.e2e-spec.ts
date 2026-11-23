import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './create-app';

const badBody = { quantity: 'abc' };

describe('04 validation: DTO types are not checked at runtime', () => {
  let app: INestApplication;
  afterEach(() => app.close());

  it('VALIDATION=off: the bad body is accepted as-is (201)', async () => {
    app = await createApp({ validation: false });
    const res = await request(app.getHttpServer()).post('/validation/orders').send(badBody).expect(201);
    expect(res.body).toEqual({ received: { quantity: 'abc' }, quantityType: 'string' });
  });

  it('VALIDATION=on: ValidationPipe rejects it (400)', async () => {
    app = await createApp({ validation: true });
    const res = await request(app.getHttpServer()).post('/validation/orders').send(badBody).expect(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        'productId must be a string',
        'quantity must be an integer number',
      ]),
    );
  });

  it('VALIDATION=on: a valid body passes (201)', async () => {
    app = await createApp({ validation: true });
    await request(app.getHttpServer())
      .post('/validation/orders')
      .send({ productId: 'book', quantity: 2 })
      .expect(201);
  });
});
