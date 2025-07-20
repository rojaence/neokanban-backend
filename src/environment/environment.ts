import * as dotenv from 'dotenv';
import * as path from 'path';

console.log(path.resolve(__dirname, '.env'));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvironmentConfigI {
  USER_DEFAULT_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
}

const environment: EnvironmentConfigI = {
  USER_DEFAULT_PASSWORD: String(process.env.USER_DEFAULT_PASSWORD || '12345'),
  JWT_SECRET: String(process.env.JWT_SECRET || ''),
  JWT_EXPIRATION: Number(process.env.JWT_EXPIRATION || '3600'),
};

export default environment;
