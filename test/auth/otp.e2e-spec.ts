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

interface OtpStatusResponse {
  data: {
    valid: boolean;
  };
}

interface OtpVerifyResponse {
  data: {
    verified: boolean;
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

  it('/ (POST) should generate a otp and verify', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/otp/generate')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(HttpStatus.CREATED);
    const body = res.body as GenerateOtpResponse;
    expect(body.data.code).toBeDefined();

    const verify = await request(testApp.getHttpServer())
      .post('/otp/verify')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
        code: body.data.code,
      })
      .set('Authorization', `Bearer ${token}`);

    const verifyBody = verify.body as OtpVerifyResponse;
    expect(verify.status).toBe(HttpStatus.OK);
    expect(verifyBody.data.verified).toBe(true);
  });

  it('/ (POST) should set as verified and get correct status when sent a valid code', async () => {
    const res = await request(testApp.getHttpServer())
      .post('/otp/generate')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
      })
      .set('Authorization', `Bearer ${token}`);
    const body = res.body as GenerateOtpResponse;
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(body.data.code).toBeDefined();

    const verify = await request(testApp.getHttpServer())
      .post('/otp/verify')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
        code: body.data.code,
      })
      .set('Authorization', `Bearer ${token}`);

    const verifyBody = verify.body as OtpVerifyResponse;
    expect(verify.status).toBe(HttpStatus.OK);
    expect(verifyBody.data.verified).toBe(true);

    const statusRes = await request(testApp.getHttpServer())
      .post('/otp/active')
      .send({
        processType: OtpProcessEnum.CHANGE_PASSWORD,
      })
      .set('Authorization', `Bearer ${token}`);

    const statusBody = statusRes.body as OtpStatusResponse;
    expect(statusRes.status).toBe(HttpStatus.OK);
    expect(statusBody.data.valid).toBe(true);
  });
});
