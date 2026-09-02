import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationRequestDto } from './dto/notificationRequest.dto';
import { SkipAuth } from '../shared/decorators/skipAuth.decorator';
import { Notification } from './entities/notification.entity';

@Controller()
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Both handlers match on the caller's own id, so there is no resource to
  // check an ability against.
  @MessagePattern('notification.get')
  @SkipAuth()
  async getNotification(
    @Payload() data: NotificationRequestDto,
  ): Promise<Notification | undefined> {
    return await this.notificationService.getNotification(
      data.userId,
      data.notificationId,
    );
  }

  @MessagePattern('notification.delete')
  @SkipAuth()
  async deleteNotification(@Payload() data: NotificationRequestDto) {
    await this.notificationService.deleteNotification(
      data.userId,
      data.notificationId,
    );
  }
}
