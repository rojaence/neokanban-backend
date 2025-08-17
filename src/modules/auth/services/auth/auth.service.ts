import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../models/login.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { JwtService } from '../jwt/jwt.service';
import {
  JwtBlacklistCreateDTO,
  JwtRevokeReason,
} from '../../models/jwt-blacklist.interface';
import { JwtBlacklistRepository } from '../../repositories/jwt-blacklist.repository';
import { randomUUID } from 'node:crypto';
import environment from '@src/environment/environment';
import { SignOptions } from 'jsonwebtoken';
import { AuthAccessDto } from '../../models/auth.interface';
import { JwtWhitelistRepository } from '../../repositories/jwt-whitelist.repository';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly translation: TranslationService,
    private readonly jwtService: JwtService,
    private readonly jwtBlacklistRepository: JwtBlacklistRepository,
    private readonly jwtWhitelistRepository: JwtWhitelistRepository,
  ) {}

  async login(credentials: LoginDto): Promise<AuthAccessDto> {
    const user = await this.authRepository.findUserByUsername(
      credentials.username,
    );
    if (!user)
      throw new UnauthorizedException(
        this.translation.t('auth.invalidCredentials'),
      );

    const isValid = await this.bcryptService.chechPasswordHash(
      credentials.password,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException(
        this.translation.t('auth.invalidCredentials'),
      );
    }

    const authTokens = this.generateAuthTokens(user);
    return authTokens;
  }

  async profile(username: string) {
    const user = await this.authRepository.findUserProfileByUsername(username);
    if (!user)
      throw new UnauthorizedException(this.translation.t('auth.userNotFound'));
    return user;
  }

  async logout(payload: JwtBlacklistCreateDTO) {
    const doc = await this.jwtBlacklistRepository.create(payload);
    const pairRefreshToken = await this.jwtWhitelistRepository.findInWhitelist(
      payload.jti,
    );
    if (pairRefreshToken) {
      await this.jwtWhitelistRepository.delete(pairRefreshToken._id);
      await this.jwtBlacklistRepository.create({
        userId: payload.userId,
        jti: pairRefreshToken.jti,
        revokedAt: new Date(),
        exp: pairRefreshToken.exp,
        reason: JwtRevokeReason.LOGOUT,
      });
    }
    return doc;
  }

  async refreshAuth(
    accessTokenJti: string,
    user: Pick<User, 'username' | 'id'>,
  ) {
    const pairRefreshToken =
      await this.jwtWhitelistRepository.findInWhitelist(accessTokenJti);
    if (!pairRefreshToken)
      throw new UnauthorizedException(
        this.translation.t('auth.invalidCredentials'),
      );
    await this.jwtWhitelistRepository.delete(pairRefreshToken._id);
    await this.jwtBlacklistRepository.create({
      userId: user.id,
      jti: pairRefreshToken.jti,
      revokedAt: new Date(),
      exp: pairRefreshToken.exp,
      reason: JwtRevokeReason.REFRESH,
    });
    const authTokens = this.generateAuthTokens(user);
    return authTokens;
  }

  private async generateAuthTokens(user: Pick<User, 'username' | 'id'>) {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();
    const accessToken = this.jwtService.generateToken({
      username: user.username,
      userId: user.id,
      jti: accessJti,
    });

    const refreshToken = this.jwtService.generateToken(
      {
        username: user.username,
        userId: user.id,
        jti: refreshJti,
      },
      {
        expiresIn:
          environment.JWT_REFRESH_EXPIRATION as SignOptions['expiresIn'],
      },
    );

    const refreshDecoded = this.jwtService.decodeToken(refreshToken);

    await this.jwtWhitelistRepository.create({
      userId: user.id,
      jti: refreshJti,
      pairTokenJti: accessJti,
      exp: new Date(refreshDecoded.decoded!.exp! * 1000),
      revokedAt: null,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
