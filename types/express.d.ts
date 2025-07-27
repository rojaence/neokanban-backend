import { IJwtPayload } from '@src/modules/auth/models/auth.interface';

declare module 'express' {
  interface Request {
    user: IJwtPayload | null;
  }
}
