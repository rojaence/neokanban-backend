import { Injectable } from '@nestjs/common';
import { sign, SignOptions, verify, decode, JwtPayload } from 'jsonwebtoken';
import environment from '@environment/environment';
import { IJwtPayload } from '../../models/auth.interface';

@Injectable()
export class JwtService {
  private secretKey = environment.JWT_SECRET ?? 'default';

  generateToken(data: IJwtPayload, options?: Partial<SignOptions>) {
    const expiresIn = environment.JWT_EXPIRATION;
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
