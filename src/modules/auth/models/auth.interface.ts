import { JwtPayload } from 'jsonwebtoken';

export interface CredentialsI {
  username: string;
  password: string;
}

export interface IJwtPayload extends JwtPayload {
  username: string;
  userId: string;
}

export interface IDecodedToken {
  decoded: IJwtPayload | string | null;
  valid: boolean;
}

export interface AuthAccessDto {
  accessToken: string;
  refreshToken: string;
}
