import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;

  const mockNotificationService = {
    getAllNotifications: vi.fn(),
    getNotification: vi.fn(),
    createNotification: vi.fn(),
    updateUnread: vi.fn(),
    deleteNotification: vi.fn(),
    removeMember: vi.fn(),
    removeProject: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    })
      .overrideProvider(NotificationService)
      .useValue(mockNotificationService)
      .compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
