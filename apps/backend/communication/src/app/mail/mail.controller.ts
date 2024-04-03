import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserLoginDto } from '@tasktime/dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('auth.sendLoginLink')
  async handleLoginRequest(@Payload() data: UserLoginDto): Promise<boolean> {
    return await this.mailService.sendLoginLink(data);
  }
}
