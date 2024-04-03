import Mail from 'nodemailer/lib/mailer';

export interface CustomMailOptions extends Mail.Options {
  template?: string;
  context?: Record<string, any>;
}
