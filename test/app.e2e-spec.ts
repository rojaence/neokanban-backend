import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './app-e2e-setup';
import { App } from 'supertest/types';
import { PrismaService } from '@src/database/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let testApp: INestApplication<App>;
  let db: PrismaService;

  beforeAll(async () => {
    const { app, module } = await setupTestApp();
    testApp = app;
    db = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('should be connect to database', async () => {
    const query = await db.$queryRaw`select now()`;
    expect(query).toBeDefined();
  });

  it('/ (GET)', () => {
    return request(testApp.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
