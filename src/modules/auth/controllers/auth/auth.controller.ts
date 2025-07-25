import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../../models/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { HttpResponse } from '@src/common/helpers/http-response';
import { TranslationService } from '@src/common/helpers/i18n-translation';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly translation: TranslationService,
  ) {}

  @Post()
  async login(@Body() credentials: LoginDto) {
    const token = await this.authService.login(credentials);
    return HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: {
        token,
      },
      message: this.translation.t('validation.httpMessages.success') as string,
    });
  }
}
