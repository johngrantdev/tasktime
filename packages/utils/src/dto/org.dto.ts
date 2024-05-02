import { Type } from "class-transformer";
import {
  IsString,
  IsUUID,
  ValidateNested,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from "class-validator";

export class OrgDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  description: string;

  constructor(data: OrgDto) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
  }
}

export class AllOrgsDto {
  @ValidateNested()
  @Type(() => OrgDto)
  orgs: OrgDto[] = [];
}

export class GetAllOrgsDto {
  @IsUUID()
  userId = "";
}

export class GetOrgDto {
  @IsUUID()
  orgId = "";
}

export class NewOrgDto {
  @IsString()
  @IsNotEmpty()
  name = "";
}

export class CreateOrgDto {
  @IsUUID()
  userId = "";

  @IsObject()
  newOrg: NewOrgDto = new NewOrgDto();
}

export class OrgUpdatesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @IsOptional()
  @IsString()
  description: string | undefined;
}

export class UpdateOrgDto {
  @IsUUID()
  orgId = "";

  @IsObject()
  orgUpdates: OrgUpdatesDto = new OrgUpdatesDto();
}

export class DeleteOrgDto {
  @IsUUID()
  orgId = "";
}
