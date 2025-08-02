import { JwtPayload } from 'jsonwebtoken';

export interface CredentialsI {
  username: string;
  password: string;
}

export interface IJwtPayload extends JwtPayload {
  username: string;
  roleId: string | number;
  userId: string;
}

export interface IDecodedToken {
  decoded: IJwtPayload | string | null;
  valid: boolean;
}
