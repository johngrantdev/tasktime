import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockEventEmitter = {
    emit: vi.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: vi.fn(),
    getReference: vi.fn(),
  };

  const mockNotificationRepository = {
    findOne: vi.fn(),
    assign: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
