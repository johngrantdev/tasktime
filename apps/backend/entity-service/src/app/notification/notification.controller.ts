import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from '../user/dto/userRequest.dto';
import { Notification } from './entities/notification.entity';

@Controller()
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: string,
  ): Promise<Notification | undefined> {
    const notification = await this.notificationService.getNotification(
      req.user.id,
      notificationId,
    );
    if (notification) {
      return notification;
    }
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: string,
  ) {
    await this.notificationService.deleteNotification(
      req.user.id,
      notificationId,
    );
  }
}
