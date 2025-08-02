import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../../models/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { HttpResponse } from '@src/common/helpers/http-response';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import environment from '@src/environment/environment';
import { Response } from 'express';
import { AuthGuard } from '@src/common/guards/auth/auth.guard';
import { User } from '@src/common/decorators/user/user.decorator';
import { IJwtPayload } from '../../models/auth.interface';
import { CredentialsEnum } from '@src/common/constants/auth';
import { randomUUID } from 'crypto';
import { JwtRevokeReason } from '../../models/jwt-blacklist.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly translation: TranslationService,
  ) {}

  @Post('/login')
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(credentials);

    response.cookie(CredentialsEnum.tokenKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: environment.JWT_EXPIRATION,
      sameSite: 'lax',
    });

    const result = HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: {
        token,
      },
      message: this.translation.t('validation.httpMessages.success') as string,
    });

    response.status(HttpStatus.OK).json(result);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@User() user: IJwtPayload) {
    const userProfile = await this.authService.profile(user.username);
    return HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: {
        userProfile,
      },
      message: this.translation.t('validation.httpMessages.success') as string,
    });
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(
    @User() user: IJwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie(CredentialsEnum.tokenKey, null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'lax',
    });

    await this.authService.logout({
      exp: new Date(user.exp! * 1000),
      jti: randomUUID(),
      revokedAt: new Date(),
      userId: user.userId,
      reason: JwtRevokeReason.LOGOUT,
    });

    const result = HttpResponse.success({
      statusCode: HttpStatus.OK,
      message: this.translation.t('validation.httpMessages.success') as string,
    });

    response.status(HttpStatus.OK).json(result);
  }
}
