import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './create-app';

describe('01 transactions: no @Transactional in Nest', () => {
  let app: INestApplication;
  beforeEach(async () => (app = await createApp()));
  afterEach(() => app.close());

  it('without a transaction, the order row survives the failed payment', async () => {
    await request(app.getHttpServer()).post('/transactions/without/book').expect(500);
    const { body } = await request(app.getHttpServer()).get('/transactions/counts');
    expect(body).toEqual({ orders: 1, payments: 0 });
  });

  it('inside dataSource.transaction(), the failure rolls everything back', async () => {
    await request(app.getHttpServer()).post('/transactions/with/book').expect(500);
    const { body } = await request(app.getHttpServer()).get('/transactions/counts');
    expect(body).toEqual({ orders: 0, payments: 0 });
  });
});
