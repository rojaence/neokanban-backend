import { Injectable } from '@nestjs/common';
import {
  sign,
  SignOptions,
  verify,
  decode,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken';
import environment from '@environment/environment';
import { IJwtPayload } from '../../models/auth.interface';
import { JWT_RESPONSE_MESSAGES } from '../../constants/jwtResponseMessages';

@Injectable()
export class JwtService {
  private secretKey = environment.JWT_SECRET ?? 'default';

  generateToken(data: IJwtPayload, options?: Partial<SignOptions>) {
    const expiresIn = environment.JWT_EXPIRATION as SignOptions['expiresIn'];
    let jwtOptions: Partial<SignOptions> = {};
    const payload = {
      ...data,
    };
    jwtOptions = { ...options, expiresIn: options?.expiresIn ?? expiresIn };
    return sign(payload, this.secretKey, jwtOptions);
  }

  verifyToken(token: string) {
    try {
      const decoded = verify(token, this.secretKey);
      return {
        decoded: decoded as IJwtPayload,
        valid: true,
        message: JWT_RESPONSE_MESSAGES.Ok,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          decoded: null,
          valid: false,
          message: JWT_RESPONSE_MESSAGES.AuthExpired,
        };
      }
      if (error instanceof Error) {
        return {
          decoded: null,
          valid: false,
          message: JWT_RESPONSE_MESSAGES.Error,
        };
      }
      return {
        decoded: null,
        valid: false,
        message: '',
      };
    }
  }

  decodeToken(token: string) {
    try {
      const decoded = decode(token) as JwtPayload;
      return {
        decoded: decoded as IJwtPayload,
        valid: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          decoded: null,
          valid: false,
        };
      }
      return {
        decoded: null,
        valid: false,
      };
    }
  }
}
