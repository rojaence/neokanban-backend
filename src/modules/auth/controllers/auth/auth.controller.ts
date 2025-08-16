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
import { JwtRevokeReason } from '../../models/jwt-blacklist.interface';
import { OtpService } from '../../services/otp/otp.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly translation: TranslationService,
  ) {}

  @ApiOperation({ summary: 'Login with user credentials' })
  @ApiOkResponse({ description: 'Return an access token' })
  @ApiBadRequestResponse({ description: 'Invalid Credentials' })
  @Post('/login')
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authTokens = await this.authService.login(credentials);

    response.cookie(CredentialsEnum.tokenKey, authTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: environment.COOKIE_EXPIRATION,
      sameSite: 'lax',
    });

    const result = HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: authTokens,
      message: this.translation.t('validation.httpMessages.success') as string,
    });

    response.status(HttpStatus.OK).json(result);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user authenticated profile' })
  @ApiOkResponse({ description: 'Return user profile data' })
  @ApiNotFoundResponse({ description: 'Not found profile data' })
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
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse()
  @ApiBearerAuth()
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
      jti: user.jti!,
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
