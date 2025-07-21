import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env.test'),
  quiet: true,
});

export interface EnvironmentConfigI {
  USER_DEFAULT_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  USER_DEFAULT_PASSWORD_HASH: string;
}

const environment: EnvironmentConfigI = {
  USER_DEFAULT_PASSWORD: String(process.env.USER_DEFAULT_PASSWORD || '12345'),
  JWT_SECRET: String(process.env.JWT_SECRET || ''),
  JWT_EXPIRATION: Number(process.env.JWT_EXPIRATION || '3600'),
  USER_DEFAULT_PASSWORD_HASH: String(
    process.env.USER_DEFAULT_PASSWORD_HASH || '',
  ),
};

export default environment;
