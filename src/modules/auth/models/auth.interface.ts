export interface CredentialsI {
  username: string;
  password: string;
}

export interface IJwtPayload {
  username: string;
  roleId: string | number;
}

export interface IDecodedToken {
  decoded: IJwtPayload | string | null;
  valid: boolean;
}
