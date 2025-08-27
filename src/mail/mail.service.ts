import { Injectable } from '@nestjs/common';
import environment from '@src/environment/environment';
import { createTransport, Transporter } from 'nodemailer';
import {
  HelloMailOptionProps,
  MailOptionProps,
  TemplateName,
} from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { TranslationService } from '@src/common/helpers/i18n-translation';

@Injectable()
export class MailService {
  private transporter: Transporter;
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
      from: environment.MAIL_USER,
      subject: this.translation.t('mail.helloMail.subject') as string,
      text,
      html,
    };
    const info = (await this.transporter.sendMail(mailOptions)) as unknown;
    return info;
  }

  loadTemplate(templateName: TemplateName, variables: object) {
    const htmlPath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'hello',
      `${templateName}.html`,
    );
    const textPath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'hello',
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
