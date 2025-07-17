import * as dotenv from 'dotenv';
import * as path from 'path';

console.log(path.resolve(__dirname, '.env'));
dotenv.config({ path: path.resolve(__dirname, '.env') });

export interface EnvironmentConfigI {
  userDefaultPassword: string;
}

const environment: EnvironmentConfigI = {
  userDefaultPassword: process.env.USER_DEFAULT_PASSWORD || '',
};

export default environment;
