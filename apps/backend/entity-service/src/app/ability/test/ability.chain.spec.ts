import 'reflect-metadata';
import { ProjectDto } from 'tasktime-utils';
import { AbilityFactory, Action } from '../ability.factory';
import { OrgMemberRole } from '../../org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from '../../project/enum/projectMemberRole.enum';
import { OrgMemberService } from '../../org/orgMember/orgMember.service';
import { ProjectService } from '../../project/project.service';
import { ItemService } from '../../item/item.service';

const project = {
  id: 'project-id',
  orgId: 'org-id',
  isHidden: false,
} as ProjectDto;

const factory = ({
  orgRole,
  projectRole,
}: {
  orgRole?: OrgMemberRole;
  projectRole?: ProjectMemberRole;
}) => {
  const orgMembers = {
    getOrgMember: vi.fn(async () => {
      if (!orgRole) throw new Error('not an org member');
      return { role: orgRole };
    }),
  } as unknown as OrgMemberService;
  const projects = {
    getProject: vi.fn(async () => project),
    getMember: vi.fn(async () => {
      if (!projectRole) throw new Error('not a project member');
      return { role: projectRole };
    }),
  } as unknown as ProjectService;
  const items = {
    getItem: vi.fn(),
    getMember: vi.fn(),
  } as unknown as ItemService;
  return new AbilityFactory(orgMembers, projects, items);
};

describe('AbilityFactory chain resolution', () => {
  it('resolves the org from the project when the caller sends only a projectId', async () => {
    const ability = await factory({
      orgRole: OrgMemberRole.Admin,
      projectRole: ProjectMemberRole.Admin,
    }).defineAbility({ userId: 'user-id', projectId: 'project-id' });

    expect(ability.can(Action.Update, ProjectDto)).toBe(true);
  });

  it('grants nothing on a project in an org the caller does not belong to', async () => {
    const ability = await factory({
      projectRole: ProjectMemberRole.Admin,
    }).defineAbility({ userId: 'user-id', projectId: 'project-id' });

    expect(ability.can(Action.Read, ProjectDto)).toBe(false);
    expect(ability.can(Action.Update, ProjectDto)).toBe(false);
  });

  it('does not grant project management to an org member who is not on the project', async () => {
    const ability = await factory({
      orgRole: OrgMemberRole.Member,
    }).defineAbility({ userId: 'user-id', projectId: 'project-id' });

    expect(ability.can(Action.Read, ProjectDto)).toBe(true);
    expect(ability.can(Action.Update, ProjectDto)).toBe(false);
  });
});
