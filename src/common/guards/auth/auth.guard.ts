import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialsEnum } from '@src/common/constants/auth';
import { TranslationService } from '@src/common/helpers/i18n-translation';
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
    let authToken = request.cookies[CredentialsEnum.tokenKey] as string;
    if (!authToken) {
      const authHeader = request.headers.authorization;
      authToken = authHeader ? authHeader.split(' ')[1] : '';
    }
    const invalidMessage = this.translation.t(
      'auth.invalidCredentials',
    ) as string;
    const isValidAuth = this.jwtService.verifyToken(authToken);
    if (!authToken || !isValidAuth.valid)
      throw new UnauthorizedException(invalidMessage);
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
