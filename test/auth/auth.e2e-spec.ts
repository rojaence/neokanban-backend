/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestApp } from '../app-e2e-setup';
import { TranslationService } from '@src/common/helpers/i18n-translation';

describe('AuthController (e2e)', () => {
  let testApp: INestApplication<App>;
  let translationService: TranslationService;

  beforeAll(async () => {
    const { app, module } = await setupTestApp();
    testApp = app;
    translationService = module.get<TranslationService>(TranslationService);
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('/ (POST) should return a token with valid credentials', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'ronnye',
        password: '12345',
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('token');
    expect(typeof res.body.data.token).toBe('string');
  });

  it('/ (POST) should return a 401 with invalid credentials', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'ronnye',
        password: 'no valid password',
      });
    console.log('🚀 ~ res:', res.body);
    const errorMessage = translationService.t(
      'auth.invalidCredentials',
    ) as string;
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe(errorMessage);
  });
});
