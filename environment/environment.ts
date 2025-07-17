import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface EnvironmentConfigI {
  userDefaultPassword: string;
}

const environment: EnvironmentConfigI = {
  userDefaultPassword: process.env.USER_DEFAULT_PASSWORD || '',
};

export default environment;
