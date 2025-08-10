import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponse } from './common/helpers/http-response';
import { TranslationService } from './common/helpers/i18n-translation';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translation: TranslationService,
  ) {}

  @Get()
  getHello() {
    return HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: this.appService.getHello(),
      message: this.translation.t('validation.httpMessages.success') as string,
    });
  }
}
