import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './create-app';

describe('03 request scope bubbles up the injection chain', () => {
  let app: INestApplication;
  beforeAll(async () => (app = await createApp()));
  afterAll(() => app.close());

  it('rebuilds the context, the service AND the controller on every request', async () => {
    const first = (await request(app.getHttpServer()).get('/request-scope/request-scoped')).body;
    const second = (await request(app.getHttpServer()).get('/request-scope/request-scoped')).body;

    expect(second.requestContextId).not.toBe(first.requestContextId);
    expect(second.serviceId).not.toBe(first.serviceId);
    expect(second.controllerId).not.toBe(first.controllerId);
  });

  it('keeps a chain without request-scoped dependencies as singletons', async () => {
    const first = (await request(app.getHttpServer()).get('/request-scope/singleton')).body;
    const second = (await request(app.getHttpServer()).get('/request-scope/singleton')).body;

    expect(second).toEqual(first);
  });
});
