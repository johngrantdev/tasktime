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
import { ItemDto, OrgDto, ProjectDto } from '@tasktime/dto';
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

  async defineAbility({ userId, orgId, projectId, itemId }: defineAbilityDto) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Create, OrgDto);

    // let org: OrgDto;
    let project: ProjectDto;
    let item: ItemDto;

    if (orgId) {
      const orgMember = await this.orgMemberService.getOrgMember(userId, orgId);
      if (orgMember) {
        if (orgMember.role === OrgMemberRole.Admin) {
          can(Action.Read, ProjectDto); // can see all project including hidden
          can(Action.Manage, OrgDto);
        }
        if (
          orgMember.role === OrgMemberRole.ProjectManager ||
          orgMember.role === OrgMemberRole.Admin
        ) {
          can(Action.Create, ProjectDto);
        }
        if (
          orgMember.role === OrgMemberRole.Member ||
          orgMember.role === OrgMemberRole.ProjectManager ||
          orgMember.role === OrgMemberRole.Admin
        ) {
          can(Action.Read, OrgDto);
          if (projectId) {
            project = await this.projectService.getProject(projectId);
            // check project is in org
            if (project && project.orgId === orgId) {
              if (!project.isHidden) {
                can(Action.Read, ProjectDto);
              }
              const projectMember = await this.projectService.getMember(
                userId,
                projectId,
              );
              if (projectMember) {
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
                  projectMember.role === ProjectMemberRole.Viewer ||
                  projectMember.role === ProjectMemberRole.Member ||
                  projectMember.role === ProjectMemberRole.Admin
                ) {
                  can(Action.Read, ProjectDto);
                  if (itemId) {
                    item = await this.itemService.getItem(itemId);
                    // check item is in project
                    if (item && item.projectId === projectId) {
                      const itemMember = await this.itemService.getMember(
                        userId,
                        itemId,
                      );
                      if (itemMember) {
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
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
