import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { Notification } from '../entities/notification.entity';
import { NotificationService } from '../notification.service';

describe('NotificationService', () => {
  it('uses one fork for a read update', async () => {
    const notification = new Notification();
    const localEm = {
      findOne: vi.fn().mockResolvedValue(notification),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new NotificationService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    await service.updateRead('notification-id', true);

    expect(em.fork).toHaveBeenCalledOnce();
    expect(localEm.findOne).toHaveBeenCalledWith(
      Notification,
      'notification-id',
    );
    expect(localEm.persist).toHaveBeenCalledWith(notification);
    expect(localEm.flush).toHaveBeenCalledOnce();
    expect(notification.read).toBe(true);
  });
});
