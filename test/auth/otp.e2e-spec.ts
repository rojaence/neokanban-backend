import { HttpStatus, INestApplication } from '@nestjs/common';
import { OtpProcessEnum } from '@src/modules/auth/models/otp.interface';
import {
  defaultFakePassword,
  fakeAdminUser,
  FakeUserModel,
} from '@src/test/fakes/user';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestApp } from '../app-e2e-setup';

interface GenerateOtpResponse {
  data: {
    code: string;
  };
}

interface TokenResponse {
  data: {
    token: string;
  };
}

describe('OtpController (e2e)', () => {
  let testApp: INestApplication<App>;
  let userData: FakeUserModel;
  let token: string;

  beforeAll(async () => {
    const { app } = await setupTestApp();
    testApp = app;
  });

  afterAll(async () => {
    await testApp.close();
  });

  beforeEach(async () => {
    userData = fakeAdminUser;
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send({
        username: userData.username,
        password: defaultFakePassword,
      });
    const body = res.body as TokenResponse;
    token = body.data.token;
  });

  it('/ (POST) should generate a otp code and process', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/otp/generate')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(HttpStatus.CREATED);
    const body = res.body as GenerateOtpResponse;
    expect(body.data.code).toBeDefined();
  });
});
