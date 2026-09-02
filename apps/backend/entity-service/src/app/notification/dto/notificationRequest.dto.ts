import { IsUUID } from 'class-validator';

export class NotificationRequestDto {
  @IsUUID()
  userId = '';

  @IsUUID()
  notificationId = '';
}
