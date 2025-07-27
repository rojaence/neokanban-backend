import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginDto } from '../../models/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { HttpResponse } from '@src/common/helpers/http-response';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import environment from '@src/environment/environment';
import { Response } from 'express';

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

    response.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: environment.JWT_EXPIRATION,
      sameSite: 'lax',
      path: '/',
    });

    const result = HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: {
        token,
      },
      message: this.translation.t('validation.httpMessages.success') as string,
    });

    return response.status(HttpStatus.OK).json(result);
  }
}
