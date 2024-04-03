import { ItemDto, OrgDto, ProjectDto } from '@tasktime/dto';
import { RequiredRule } from '../shared/decorators/abilities.decorator';
import { Action } from './ability.factory';

// Org
export class ManageOrgAbility implements RequiredRule {
  action = Action.Manage;
  subject = OrgDto;
}

export class CreateOrgAbility implements RequiredRule {
  action = Action.Create;
  subject = OrgDto;
}

export class ViewOrgAbility implements RequiredRule {
  action = Action.Read;
  subject = OrgDto;
}

export class UpdateOrgAbility implements RequiredRule {
  action = Action.Update;
  subject = OrgDto;
}

export class DeleteOrgAbility implements RequiredRule {
  action = Action.Delete;
  subject = OrgDto;
}

// Project
export class ManageProjectAbility implements RequiredRule {
  action = Action.Manage;
  subject = ProjectDto;
}

export class CreateProjectAbility implements RequiredRule {
  action = Action.Create;
  subject = ProjectDto;
}

export class ViewProjectAbility implements RequiredRule {
  action = Action.Read;
  subject = ProjectDto;
}

export class UpdateProjectAbility implements RequiredRule {
  action = Action.Update;
  subject = ProjectDto;
}

export class DeleteProjectAbility implements RequiredRule {
  action = Action.Delete;
  subject = ProjectDto;
}

//Item
export class ManageItemAbility implements RequiredRule {
  action = Action.Manage;
  subject = ItemDto;
}

export class CreateItemAbility implements RequiredRule {
  action = Action.Create;
  subject = ItemDto;
}

export class ViewItemAbility implements RequiredRule {
  action = Action.Read;
  subject = ItemDto;
}
export class UpdateItemAbility implements RequiredRule {
  action = Action.Update;
  subject = ItemDto;
}

export class DeleteItemAbility implements RequiredRule {
  action = Action.Delete;
  subject = ItemDto;
}
