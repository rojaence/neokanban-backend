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

export type TemplateName = 'helloMail';
