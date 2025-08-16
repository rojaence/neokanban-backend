export interface EnvironmentConfigI {
  JWT_SECRET: string;
  JWT_EXPIRATION: string | number;
  USER_DEFAULT_PASSWORD: string;
  DATABASE_URL: string;
  MONGO_DATABASE_URL: string;
  DEFAULT_LANGUAGE: string;
  COOKIE_EXPIRATION: number;
  JWT_REFRESH_EXPIRATION: string | number;
}

const environment: EnvironmentConfigI = {
  USER_DEFAULT_PASSWORD: String(process.env.USER_DEFAULT_PASSWORD || ''),
  JWT_SECRET: String(process.env.JWT_SECRET || ''),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION
    ? isNaN(Number(process.env.JWT_EXPIRATION))
      ? process.env.JWT_EXPIRATION
      : Number(process.env.JWT_EXPIRATION)
    : '1h',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION
    ? isNaN(Number(process.env.JWT_REFRESH_EXPIRATION))
      ? process.env.JWT_REFRESH_EXPIRATION
      : Number(process.env.JWT_REFRESH_EXPIRATION)
    : '2W',
  COOKIE_EXPIRATION: Number(process.env.COOKIE_EXPIRATION) || 3600,
  DATABASE_URL: String(process.env.DATABASE_URL || ''),
  MONGO_DATABASE_URL: String(process.env.MONGO_DATABASE_URL || ''),
  DEFAULT_LANGUAGE: String(process.env.DEFAULT_LANGUAGE || 'es'),
};

export default environment;
