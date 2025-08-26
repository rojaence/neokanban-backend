import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialsEnum } from '@src/common/constants/auth';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { JWT_RESPONSE_MESSAGES } from '@src/modules/auth/constants/jwtResponseMessages';
import { JwtBlacklistRepository } from '@src/modules/auth/repositories/jwt-blacklist.repository';
import { JwtService } from '@src/modules/auth/services/jwt/jwt.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly translation: TranslationService,
    private readonly jwtBlacklistRepository: JwtBlacklistRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const invalidMessage = this.translation.t(
      'auth.invalidCredentials',
    ) as string;

    let authToken = request.cookies[CredentialsEnum.tokenKey] as string;
    let validation = authToken ? this.jwtService.verifyToken(authToken) : null;

    if (!authToken || !validation?.valid) {
      const authHeader = request.headers.authorization;
      authToken = authHeader ? authHeader.split(' ')[1] : '';
      validation = authToken ? this.jwtService.verifyToken(authToken) : null;
    }

    if (!authToken || !validation?.valid) {
      if (validation?.message === JWT_RESPONSE_MESSAGES.AuthExpired) {
        throw new UnauthorizedException(JWT_RESPONSE_MESSAGES.AuthExpired);
      }
      throw new UnauthorizedException(invalidMessage);
    }

    const tokenData = this.jwtService.decodeToken(authToken);

    const inBlacklist = await this.jwtBlacklistRepository.findInBlacklist(
      tokenData.decoded!.jti!,
    );
    console.log('🚀 ~ AuthGuard ~ canActivate ~ inBlacklist:', inBlacklist);
    if (inBlacklist) {
      throw new UnauthorizedException(invalidMessage);
    }

    request.user = tokenData.decoded;
    return true;
  }
}
