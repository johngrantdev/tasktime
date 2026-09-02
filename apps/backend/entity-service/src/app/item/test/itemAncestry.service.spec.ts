import { EntityManager } from '@mikro-orm/postgresql';
import { ItemAncestry } from '../entities/itemAncestry.entity';
import { Item } from '../entities/item.entity';
import { ItemAncestryService } from '../itemAncestry.service';

describe('ItemAncestryService', () => {
  it('uses one fork to create an item ancestry', async () => {
    const ancestor = { id: 'ancestor-id' } as Item;
    const descendant = { id: 'descendant-id' } as Item;
    const localEm = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce(ancestor)
        .mockResolvedValueOnce(descendant),
      find: vi.fn().mockResolvedValue([]),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new ItemAncestryService(em as unknown as EntityManager);

    await service.createItemAncestry({
      userId: 'user-id',
      ancestorItemId: 'ancestor-id',
      descendantItemId: 'descendant-id',
    });

    expect(em.fork).toHaveBeenCalledOnce();
    expect(localEm.findOne).toHaveBeenNthCalledWith(1, Item, 'ancestor-id');
    expect(localEm.findOne).toHaveBeenNthCalledWith(2, Item, 'descendant-id');
    expect(localEm.find).toHaveBeenCalledWith(ItemAncestry, {
      descendant: 'ancestor-id',
    });
    expect(localEm.persist).toHaveBeenCalledWith(expect.any(ItemAncestry));
    expect(localEm.flush).toHaveBeenCalledOnce();
  });
});
