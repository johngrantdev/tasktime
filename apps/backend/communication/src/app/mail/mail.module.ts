import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from './mailer.service';
import { MailController } from './mail.controller';

@Global()
@Module({
  imports: [],
  providers: [MailService, MailerService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
