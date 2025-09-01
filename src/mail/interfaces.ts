import { OtpProcessEnum } from '@src/modules/auth/models/otp.interface';

export interface MailOptionProps {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface HelloMailOptionProps {
  to: string;
  name: string;
}

export interface OtpEmailOptionProps {
  to: string;
  processType: OtpProcessEnum;
  processCode: string;
}

export type TemplateName = 'helloMail' | 'otpProcess';
