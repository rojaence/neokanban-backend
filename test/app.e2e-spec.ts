import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './app-e2e-setup';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let testApp: INestApplication<App>;

  beforeAll(async () => {
    const { app } = await setupTestApp();
    testApp = app;
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('/ (GET)', () => {
    return request(testApp.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
