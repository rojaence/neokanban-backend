import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { execSync } from 'child_process';
import environment from '@src/environment/environment.test';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    console.log('Entorno cargado:', environment);
    try {
      execSync('npm run seed -- --environment=test --reset', {
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('Error al ejecutar los scripts de reset y seed:', error);
      process.exit(1);
    }
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
