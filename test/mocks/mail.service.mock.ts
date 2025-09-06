import { Injectable } from '@nestjs/common';
import {
  HelloMailOptionProps,
  Mailer,
  MailOptionProps,
  OtpEmailOptionProps,
} from '@src/mail/interfaces';

@Injectable()
export class MockMailService implements Mailer {
  async send(options: MailOptionProps) {
    return Promise.resolve(options);
  }

  async sendHelloMail(options: HelloMailOptionProps) {
    return Promise.resolve(options);
  }

  async sendOtpEmail(options: OtpEmailOptionProps) {
    return Promise.resolve(options);
  }
}
