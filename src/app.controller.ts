import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponse } from './common/helpers/http-response';
import { TranslationService } from './common/helpers/i18n-translation';
import { MailService } from './mail/mail.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translation: TranslationService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'get a hello message' })
  getHello() {
    return HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: this.appService.getHello(),
      message: this.translation.t('validation.httpMessages.success') as string,
    });
  }

  @Post()
  @ApiOperation({ summary: 'send a hello message' })
  async sendHelloMail() {
    await this.mailService.sendHelloMail({
      name: 'Ronny',
      to: 'an valid email to sent',
    });
    return HttpResponse.success({
      statusCode: HttpStatus.OK,
      data: 'correcto',
      message: this.translation.t('validation.httpMessages.success') as string,
    });
  }
}
