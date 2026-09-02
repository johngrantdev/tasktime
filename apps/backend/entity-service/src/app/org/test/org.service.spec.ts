import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Org } from '../entities/org.entity';
import { OrgService } from '../org.service';

describe('OrgService', () => {
  it('flushes the fork it assigned on, and awaits it', async () => {
    const org = { id: 'org-id', name: 'Org' } as Org;
    const localEm = {
      findOne: vi.fn().mockResolvedValue(org),
      assign: vi.fn(),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    const em = {
      fork: vi.fn().mockReturnValue(localEm),
      // the global manager must not be written through
      persist: vi.fn(() => {
        throw new Error('wrote through the global EntityManager');
      }),
    };
    const service = new OrgService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    await service.updateOrg('org-id', { name: 'Renamed' });

    expect(localEm.assign).toHaveBeenCalledWith(org, { name: 'Renamed' });
    expect(localEm.flush).toHaveBeenCalledOnce();
    expect(em.persist).not.toHaveBeenCalled();
  });
});
