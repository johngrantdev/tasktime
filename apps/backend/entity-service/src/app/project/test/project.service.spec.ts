import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../project.service';

describe('ProjectService', () => {
  it('uses one fork to get a project', async () => {
    const project = {
      id: 'project-id',
      org: { id: 'org-id' },
      creator: { id: 'user-id' },
      name: 'Project',
    } as Project;
    const localEm = {
      findOne: vi.fn().mockResolvedValue(project),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new ProjectService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    const result = await service.getProject('project-id');

    expect(em.fork).toHaveBeenCalledOnce();
    expect(localEm.findOne).toHaveBeenCalledWith(Project, 'project-id');
    expect(result.id).toBe('project-id');
  });
});

describe('ProjectService update', () => {
  it('flushes the assigned changes', async () => {
    const project = {
      id: 'project-id',
      org: { id: 'org-id' },
      creator: { id: 'user-id' },
      name: 'Project',
    } as Project;
    const localEm = {
      findOne: vi.fn().mockResolvedValue(project),
      assign: vi.fn(),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    const em = { fork: vi.fn().mockReturnValue(localEm) };
    const service = new ProjectService(
      em as unknown as EntityManager,
      { emit: vi.fn() } as unknown as EventEmitter2,
    );

    await service.updateProject({
      userId: 'user-id',
      orgId: 'org-id',
      projectId: 'project-id',
      projectChanges: { description: 'changed', isHidden: false },
    });

    expect(localEm.assign).toHaveBeenCalledWith(project, {
      description: 'changed',
      isHidden: false,
    });
    expect(localEm.flush).toHaveBeenCalledOnce();
  });
});
