import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    const authHeader = request.headers.authorization;
    const authToken = authHeader ? authHeader.split(' ')[1] : '';
    const validation = authToken
      ? this.jwtService.verifyToken(authToken)
      : null;

    if (!authToken || !validation?.valid) {
      throw new UnauthorizedException(JWT_RESPONSE_MESSAGES.AuthExpired);
    }

    const tokenData = this.jwtService.decodeToken(authToken);

    const inBlacklist = await this.jwtBlacklistRepository.findInBlacklist(
      tokenData.decoded!.jti!,
    );
    if (inBlacklist) {
      throw new UnauthorizedException(invalidMessage);
    }

    request.user = tokenData.decoded;
    return true;
  }
}
