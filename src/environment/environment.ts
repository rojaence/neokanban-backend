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
  path: path.join(process.cwd(), envFile),
  quiet: true,
});

export interface EnvironmentConfigI {
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  USER_DEFAULT_PASSWORD: string;
  DATABASE_URL: string;
  MONGO_DATABASE_URL: string;
  DEFAULT_LANGUAGE: string;
}

const environment: EnvironmentConfigI = {
  USER_DEFAULT_PASSWORD: String(process.env.USER_DEFAULT_PASSWORD || ''),
  JWT_SECRET: String(process.env.JWT_SECRET || ''),
  JWT_EXPIRATION: Number(process.env.JWT_EXPIRATION || '3600'),
  DATABASE_URL: String(process.env.DATABASE_URL || ''),
  MONGO_DATABASE_URL: String(process.env.MONGO_DATABASE_URL || ''),
  DEFAULT_LANGUAGE: String(process.env.DEFAULT_LANGUAGE || 'es'),
};

export default environment;
