import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import environment from '@environment/environment';
import { IJwtPayload } from '../../models/auth.interface';

@Injectable()
export class JwtService {
  private secretKey = environment.JWT_SECRET ?? 'default';

  generateToken(data: IJwtPayload) {
    const expiredIn = environment.JWT_EXPIRATION;
    const payload = {
      ...data,
      exp: data.exp
        ? Math.floor(Date.now() / 1000) + data.exp
        : Math.floor(Date.now() / 1000) + expiredIn,
    };
    return sign(payload, this.secretKey);
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
          decoded: error.message,
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
