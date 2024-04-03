import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotificationRepository } from './repositories/notification.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Notification)
    private readonly notificationRepository: NotificationRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  notFoundError = 'Notification not found';

  // todo: return pagnated result instead of all
  async getAllNotifications(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      user: userId,
    });
    if (notifications.length === 0) {
      throw new NotFoundException(
        `Get All Notifications Service: No notifications for ${userId}`,
      );
    } else {
      return notifications;
    }
  }

  // todo move auth to CASL
  async getNotification(
    userId: string,
    notificationId: string,
  ): Promise<Notification | undefined> {
    const notification =
      await this.notificationRepository.findOne(notificationId);
    if (!notification) {
      throw new Error(`${notificationId} not found.`);
    }
    if (notification.user.id === userId) {
      return notification;
    }
  }

  async createNotification(
    notificationData: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = new Notification();
    notification.user = this.em.getReference(User, notificationData.user);
    notification.title = notificationData.title;
    notification.data = notificationData.data;
    this.em.persistAndFlush(notification);
    return notification;
  }

  async updateRead(
    notificationId: string,
    newRead: boolean,
  ): Promise<Notification> {
    const notification =
      await this.notificationRepository.findOne(notificationId);
    if (!notification) {
      throw new Error(`${notificationId} not found.`);
    }
    notification.read = newRead;
    this.em.persistAndFlush(notification);
    return notification;
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    const notification = this.notificationRepository.findOne(notificationId);
    if (!notification) {
      throw new NotFoundException(this.notFoundError);
    }
    await this.em.removeAndFlush(notification);
  }

  // move to orgService/
  // @OnEvent('org.memberInvited', { async: true })
  // async orgInvite(payload: MemberInvitedEvent) {
  //   const notificationTitle = `${
  //     payload.invitedByName !== ''
  //       ? `${payload.invitedByName} has invited you`
  //       : `You have been invited`
  //   } to join ${payload.orgName}`;
  //   const newNotification: CreateNotificationDto = {
  //     user: payload.invitedByUserId,
  //     title: notificationTitle,
  //     body: 'Click here to join',
  //     button: 'Accept',
  //     type: 'orgInvite',
  //     reference: payload.invitedByUserId.toString(),
  //   };
  //   const notification = await this.createNotification(newNotification);
  //   this.eventEmitter.emit(
  //     'notification.memberInvited',
  //     new NotificationMemberInvitedEvent(notification, payload.inviteeEmail),
  //   );
  // }
}
