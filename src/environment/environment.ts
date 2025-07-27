import * as dotenv from 'dotenv';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';

// Mapea el entorno al archivo .env correspondiente
const envFile = (() => {
  switch (nodeEnv) {
    case 'test':
      return '.env.test';
    case 'production':
      return '.env.prod';
    default:
      return '.env';
  }
})();

// Carga el archivo .env adecuado
dotenv.config({
  path: path.resolve(__dirname, `../../${envFile}`),
  quiet: true,
});

export interface EnvironmentConfigI {
  USER_DEFAULT_PASSWORD: string;
  USER_DEFAULT_PASSWORD_HASH: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  DATABASE_URL: string;
}

const environment: EnvironmentConfigI = {
  USER_DEFAULT_PASSWORD: String(process.env.USER_DEFAULT_PASSWORD || '12345'),
  USER_DEFAULT_PASSWORD_HASH: String(
    process.env.USER_DEFAULT_PASSWORD_HASH || '',
  ),
  JWT_SECRET: String(process.env.JWT_SECRET || ''),
  JWT_EXPIRATION: Number(process.env.JWT_EXPIRATION || '3600'),
  DATABASE_URL: String(process.env.DATABASE_URL || ''),
};

export default environment;
