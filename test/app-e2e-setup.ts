import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { execSync } from 'child_process';
import { App } from 'supertest/types';

interface SetupTestAppI {
  app: INestApplication<App>;
  module: TestingModule;
}

export const setupTestApp = async (): Promise<SetupTestAppI> => {
  try {
    execSync('npm run seed:test -- --reset', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error al ejecutar seed:test:', error);
    process.exit(1);
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication<App> = moduleFixture.createNestApplication();
  await app.init();
  return { app, module: moduleFixture };
};
