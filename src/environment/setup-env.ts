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
