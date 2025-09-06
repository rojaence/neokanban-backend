import { Injectable } from '@nestjs/common';
import environment from '@src/environment/environment';
import { createTransport, Transporter } from 'nodemailer';
import {
  HelloMailOptionProps,
  Mailer,
  MailOptionProps,
  OtpEmailOptionProps,
  TemplateName,
} from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { TranslationService } from '@src/common/helpers/i18n-translation';
import { OtpProcessEnum } from '@src/modules/auth/models/otp.interface';

@Injectable()
export class MailService implements Mailer {
  private transporter: Transporter;
  private readonly templatePathName: Record<TemplateName, string> = {
    helloMail: 'hello',
    otpProcess: 'otp',
  };
  constructor(private readonly translation: TranslationService) {
    this.transporter = createTransport({
      host: environment.MAIL_HOST,
      port: environment.MAIL_PORT,
      secure: false,
      auth: {
        user: environment.MAIL_USER,
        pass: environment.MAIL_PASS,
      },
    });
  }

  async send(options: MailOptionProps) {
    const info = (await this.transporter.sendMail(options)) as unknown;
    return info;
  }

  async sendHelloMail(options: HelloMailOptionProps) {
    const { html, text } = this.loadTemplate('helloMail', options);
    const mailOptions: MailOptionProps = {
      ...options,
      from: environment.MAIL_SENDER,
      subject: this.translation.t('mail.helloMail.subject') as string,
      text,
      html,
    };
    const info = (await this.transporter.sendMail(mailOptions)) as unknown;
    return info;
  }

  async sendOtpEmail(options: OtpEmailOptionProps) {
    const otpMailVariables = {
      ...options,
      processType: this.getOtpProcessName(options.processType),
    };
    const { html, text } = this.loadTemplate('otpProcess', otpMailVariables);
    const mailOptions: MailOptionProps = {
      ...options,
      from: environment.MAIL_SENDER,
      subject: this.translation.t('mail.otp.subject') as string,
      text,
      html,
    };
    const info = (await this.transporter.sendMail(mailOptions)) as unknown;
    return info;
  }

  private getOtpProcessName = (processType: OtpProcessEnum) => {
    switch (processType) {
      case OtpProcessEnum.CHANGE_PASSWORD:
        return this.translation.t('mail.otp.processType.resetPassword');
    }
  };

  private loadTemplate(templateName: TemplateName, variables: object) {
    const htmlPath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      this.templatePathName[templateName],
      `${templateName}.html`,
    );
    const textPath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      this.templatePathName[templateName],
      `${templateName}.txt`,
    );

    let html = fs.readFileSync(htmlPath, 'utf8');
    let text = fs.readFileSync(textPath, 'utf8');

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value as string);
      text = text.replace(regex, value as string);
    }

    return { html, text };
  }
}
