/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestApp } from '../app-e2e-setup';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import {
  defaultFakePassword,
  fakeAdminUser,
  FakeUserModel,
} from '@src/test/fakes/user';
import { AuthAccessDto } from '@src/modules/auth/models/auth.interface';

describe('AuthController (e2e)', () => {
  let testApp: INestApplication<App>;
  let translationService: TranslationService;
  let userData: FakeUserModel;

  beforeAll(async () => {
    const { app, module } = await setupTestApp();
    testApp = app;
    translationService = module.get<TranslationService>(TranslationService);
  });

  afterAll(async () => {
    await testApp.close();
  });

  beforeEach(() => {
    userData = fakeAdminUser;
  });

  it('/ (POST) should return a token with valid credentials', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: defaultFakePassword,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(typeof res.body.data.accessToken).toBe('string');
  });

  it('/ (POST) should return a 401 with invalid credentials', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: 'no valid password',
      });
    const errorMessage = translationService.t(
      'auth.invalidCredentials',
    ) as string;
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe(errorMessage);
  });

  it('/ (GET) should throw unauthorized if no authentication', async () => {
    const res = await request(testApp.getHttpServer()).get('/auth/profile');
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/ (POST) should logout successfully', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: defaultFakePassword,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(typeof res.body.data.accessToken).toBe('string');

    const logout = await request(testApp.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${res.body.data.accessToken}`);
    expect(logout.status).toBe(200);

    const profile = await request(testApp.getHttpServer()).get('/auth/profile');
    expect(profile.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/ (POST) should save token in blacklist when logout', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: defaultFakePassword,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(typeof res.body.data.accessToken).toBe('string');

    const logout = await request(testApp.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${res.body.data.accessToken}`);
    expect(logout.status).toBe(200);

    const token = res.body.data.accessToken as string;

    const blacklist = await request(testApp.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(blacklist.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/ (POST) should generate new auth tokens when refresh', async () => {
    const loginRes = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: defaultFakePassword,
      });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toHaveProperty('accessToken');

    const loginBody = loginRes.body.data as AuthAccessDto;

    const refreshRes = await request(testApp.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${loginBody.refreshToken}`);
    const refreshBody = refreshRes.body.data as AuthAccessDto;

    expect(refreshBody.accessToken).toBeDefined();
    expect(refreshBody.refreshToken).toBeDefined();
  });
});
