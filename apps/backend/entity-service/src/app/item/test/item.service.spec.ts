import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from '../entities/item.entity';
import { ItemService } from '../item.service';

describe('ItemService', () => {
  it('uses one fork to get an item', async () => {
    const item = {
      id: 'item-id',
      project: { id: 'project-id' },
      creator: { id: 'user-id' },
      name: 'Item',
    } as Item;
    const localEm = {
      findOneOrFail: vi.fn().mockResolvedValue(item),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new ItemService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    const result = await service.getItem('item-id');

    expect(em.fork).toHaveBeenCalledOnce();
    expect(localEm.findOneOrFail).toHaveBeenCalledWith(Item, 'item-id');
    expect(result.id).toBe('item-id');
  });
});
