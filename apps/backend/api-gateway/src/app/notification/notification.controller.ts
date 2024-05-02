import { Controller, Delete, Get, Inject, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { API_PREFIX } from '../shared/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';

@Controller(`${API_PREFIX}/notification`)
@ApiTags('notification')
export class NotificationController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy, // private itemAncestryService: ItemAncestryService
  ) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req: AuthenticatedRequest,
    @Param('notificationId') notificationId: string,
  ): Promise<Notification> {
    return await firstValueFrom(
      this.natClient.send('notification.get', {
        userId: req.user.id,
        notificationId: notificationId,
      }),
    );
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Req() req: AuthenticatedRequest,
    @Param('notificationId') notificationId: string,
  ) {
    await this.natClient.send('notification.delete', {
      userId: req.user.id,
      notificationId: notificationId,
    });
  }
}
