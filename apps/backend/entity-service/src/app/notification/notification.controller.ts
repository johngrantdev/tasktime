import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationRequestDto } from './dto/notificationRequest.dto';
import { Notification } from './entities/notification.entity';

@Controller()
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.get')
  async getNotification(
    @Payload() data: NotificationRequestDto,
  ): Promise<Notification | undefined> {
    return await this.notificationService.getNotification(
      data.userId,
      data.notificationId,
    );
  }

  @MessagePattern('notification.delete')
  async deleteNotification(@Payload() data: NotificationRequestDto) {
    await this.notificationService.deleteNotification(
      data.userId,
      data.notificationId,
    );
  }
}
