import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import type { Response } from 'express';
import { AuthController } from '../../auth/auth.controller';
import { ItemController } from '../../item/item.controller';
import { ProjectController } from '../../project/project.controller';
import { UserController } from '../../user/user.controller';
import type { AuthenticatedRequest } from '../interfaces/authenticatedRequest';

// The gateway and entity-service agree on a subject name and a payload shape.
// These assertions are the only place that agreement is checked in CI - the
// entity-service DTO field names are repeated here on purpose.
describe('NATS subject contract', () => {
  const req = { user: { id: 'user-id' } } as AuthenticatedRequest;

  const makeClient = () => {
    const client = {
      send: vi.fn().mockReturnValue(of({})),
      emit: vi.fn().mockReturnValue(of({})),
    };
    return client as unknown as ClientProxy & typeof client;
  };

  it('sends item subjects with the payload the entity-service expects', async () => {
    const client = makeClient();
    const controller = new ItemController(client);

    await controller.updateItem(req, 'item-id', { name: 'New name' });
    expect(client.send).toHaveBeenCalledWith('item.updateItem', {
      userId: 'user-id',
      itemId: 'item-id',
      itemChanges: { name: 'New name' },
    });

    await controller.getItemDescendants(req, 'item-id', '3');
    expect(client.send).toHaveBeenCalledWith('item.getDescendants', {
      userId: 'user-id',
      itemId: 'item-id',
      inputDepth: 3,
    });

    await controller.createItemAncestry(req, {
      ancestorItemId: 'ancestor-id',
      descendantItemId: 'descendant-id',
    });
    expect(client.send).toHaveBeenCalledWith('item.createItemAncestry', {
      userId: 'user-id',
      ancestorItemId: 'ancestor-id',
      descendantItemId: 'descendant-id',
    });
  });

  it('sends project subjects with the payload the entity-service expects', async () => {
    const client = makeClient();
    const controller = new ProjectController(client);

    // the guard reads orgId off the top level of the payload
    await controller.createProject(req, { name: 'Project', orgId: 'org-id' });
    expect(client.send).toHaveBeenCalledWith('project.createProject', {
      userId: 'user-id',
      orgId: 'org-id',
      newProject: { name: 'Project', orgId: 'org-id' },
    });

    await controller.updateProject(req, 'project-id', { isHidden: false });
    expect(client.send).toHaveBeenCalledWith('project.updateProject', {
      userId: 'user-id',
      projectId: 'project-id',
      projectChanges: { isHidden: false },
    });
  });

  it('sends user subjects with the payload the entity-service expects', async () => {
    const client = makeClient();
    const controller = new UserController(client);

    await controller.updateUser(req, { firstName: 'Ada' });
    expect(client.send).toHaveBeenCalledWith('user.update', {
      userId: 'user-id',
      userUpdates: { firstName: 'Ada' },
    });

    await controller.disableUser(req);
    expect(client.send).toHaveBeenCalledWith('user.update', {
      userId: 'user-id',
      userUpdates: { disabled: true },
    });
  });

  it('revokes tokens on the subject the entity-service owns', () => {
    const client = makeClient();
    const controller = new AuthController(client);
    const res = { send: vi.fn() } as unknown as Response;

    controller.revoke(req, res);

    expect(client.emit).toHaveBeenCalledWith('user.revokeAllTokenValidity', {
      userId: 'user-id',
    });
  });
});
