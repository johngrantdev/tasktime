import { MailerService } from './mailer.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from 'tasktime-utils';
import { CustomMailOptions } from './types/customMailOptions.inteface';

@Injectable()
export class MailService {
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.appName = this.configService.get<string>('APP_NAME');
    this.appUrl = this.configService.get<string>('SERVER_URL');
  }

  async sendLoginLink(payload: UserLoginDto) {
    const greeting = 'Hi there.';
    await this.mailerService.sendMail({
      to: payload.email,
      subject: `Login to ${this.appName}`,
      template: 'confirmation',
      context: {
        greeting,
        url: payload.url,
        appName: this.appName,
        appUrl: this.appUrl,
      },
    } as CustomMailOptions);
    return true;
  }

  // async sendNotification(payload: NotificationMemberInvitedEvent) {
  //   await this.mailerService.sendMail({
  //     to: payload.inviteeEmail,
  //     subject: payload.notification.title,
  //     template: 'notification',
  //     context: {
  //       title: payload.notification.title,
  //       data: payload.notification.data,
  //       url: 'url',
  //       appName: this.appName,
  //       appUrl: this.appUrl,
  //     },
  //   });
  // }
}
