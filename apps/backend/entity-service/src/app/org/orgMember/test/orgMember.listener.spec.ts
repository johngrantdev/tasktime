import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrgMemberModule } from '../orgMember.module';
import { OrgEventListeners } from '../orgMember.listener';
import { OrgMemberService } from '../orgMember.service';
import { OrgMember } from '../entities/orgMember.entity';
import { OrgMemberRole } from '../../enum/orgMemberRole.enum';
import { OrgCreatedEvent } from '../../event/orgCreated.event';

describe('OrgEventListeners', () => {
  it('is provided by its module so @OnEvent binds', () => {
    const providers = Reflect.getMetadata('providers', OrgMemberModule) ?? [];
    expect(providers).toContain(OrgEventListeners);
  });

  it('makes the org creator an admin member', async () => {
    const service = { createOrgMember: vi.fn() } as unknown as OrgMemberService;
    const listener = new OrgEventListeners(service);

    await listener.handleOrgCreatedEvent(
      new OrgCreatedEvent('org-id', 'Org', new Date(), 'creator-id'),
    );

    expect(service.createOrgMember).toHaveBeenCalledWith(
      'creator-id',
      'org-id',
      OrgMemberRole.Admin,
    );
  });

  it('forks the entity manager, having no request context of its own', async () => {
    const localEm = {
      getReference: vi.fn().mockReturnValue({}),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new OrgMemberService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    await service.createOrgMember('user-id', 'org-id', OrgMemberRole.Admin);

    expect(em.fork).toHaveBeenCalledOnce();
    expect(localEm.persist).toHaveBeenCalledWith(expect.any(OrgMember));
    expect(localEm.flush).toHaveBeenCalledOnce();
  });
});
