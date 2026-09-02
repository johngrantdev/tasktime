import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { OrgMemberRole } from '../org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from '../project/enum/projectMemberRole.enum';
import { ProjectService } from '../project/project.service';
import { ItemService } from '../item/item.service';
import { defineAbilityDto } from './dto/defineAbility.dto';
import { ItemMemberRole } from '../item/enum/itemMemberRole.enum';
import { ItemDto, OrgDto, ProjectDto } from 'tasktime-utils';
import { OrgMemberService } from '../org/orgMember/orgMember.service';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Review = 'review',
}

export type Subjects =
  | InferSubjects<typeof OrgDto | typeof ProjectDto | typeof ItemDto>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly orgMemberService: OrgMemberService,
    private readonly projectService: ProjectService,
    private readonly itemService: ItemService,
  ) {}

  // Orgs contain projects and projects contain items
  // if user is not a member of org, they do not have abilities for projects
  // if user is not a member of org or project, they do not have abilities for items

  // A request names the resource it acts on, not every id above it, so the
  // chain is resolved upward: an item names its project, a project its org.
  // Without this an ability could only ever be granted on a route that
  // happened to carry an orgId.
  async defineAbility({ userId, orgId, projectId, itemId }: defineAbilityDto) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const buildAbility = () =>
      build({
        detectSubjectType: (subject) =>
          subject.constructor as ExtractSubjectType<Subjects>,
      });

    can(Action.Create, OrgDto);

    const item = itemId
      ? await this.lookup(this.itemService.getItem(itemId))
      : null;
    const inProjectId = projectId ?? item?.projectId;
    const project = inProjectId
      ? await this.lookup(this.projectService.getProject(inProjectId))
      : null;
    const inOrgId = orgId ?? project?.orgId;

    if (!inOrgId) {
      return buildAbility();
    }

    const orgMember = await this.lookup(
      this.orgMemberService.getOrgMember(userId, inOrgId),
    );
    if (!orgMember) {
      return buildAbility();
    }

    if (orgMember.role === OrgMemberRole.Admin) {
      can(Action.Read, ProjectDto); // can see all projects including hidden
      can(Action.Manage, OrgDto);
    }
    if (
      orgMember.role === OrgMemberRole.ProjectManager ||
      orgMember.role === OrgMemberRole.Admin
    ) {
      can(Action.Create, ProjectDto);
    }
    if (
      orgMember.role !== OrgMemberRole.Member &&
      orgMember.role !== OrgMemberRole.ProjectManager &&
      orgMember.role !== OrgMemberRole.Admin
    ) {
      return buildAbility();
    }
    can(Action.Read, OrgDto);

    // the project has to belong to the org the caller is a member of
    if (!project || project.orgId !== inOrgId) {
      return buildAbility();
    }
    if (!project.isHidden) {
      can(Action.Read, ProjectDto);
    }

    const projectMember = await this.lookup(
      this.projectService.getMember(userId, project.id),
    );
    if (!projectMember) {
      return buildAbility();
    }
    if (projectMember.role === ProjectMemberRole.Admin) {
      can(Action.Manage, ProjectDto);
    }
    if (
      projectMember.role === ProjectMemberRole.Member ||
      projectMember.role === ProjectMemberRole.Admin
    ) {
      can(Action.Create, ItemDto);
    }
    if (
      projectMember.role !== ProjectMemberRole.Viewer &&
      projectMember.role !== ProjectMemberRole.Member &&
      projectMember.role !== ProjectMemberRole.Admin
    ) {
      return buildAbility();
    }
    can(Action.Read, ProjectDto);

    // the item has to belong to the project checked above
    if (!item || item.projectId !== project.id) {
      return buildAbility();
    }

    const itemMember = await this.lookup(
      this.itemService.getMember(userId, item.id),
    );
    if (!itemMember) {
      return buildAbility();
    }
    if (itemMember.role === ItemMemberRole.Owner) {
      can(Action.Manage, ItemDto);
      can(Action.Update, ItemDto);
    }
    if (itemMember.role === ItemMemberRole.Member) {
      can(Action.Update, ItemDto);
    }
    if (itemMember.role === ItemMemberRole.Reviewer) {
      can(Action.Review, ItemDto);
    }
    if (itemMember.role === ItemMemberRole.Viewer) {
      can(Action.Read, ItemDto);
    }

    return buildAbility();
  }

  // The services throw when a row is missing. For authorization that is just
  // "no access", and every branch that reads null ends in fewer abilities.
  private async lookup<T>(query: Promise<T>): Promise<T | null> {
    try {
      return await query;
    } catch {
      return null;
    }
  }
}
