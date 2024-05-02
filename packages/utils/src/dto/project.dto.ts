import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class ProjectDto {
  @IsString()
  id: string;

  @IsUUID()
  orgId: string;

  @IsString()
  name: string;

  @IsUUID()
  creatorId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  description: string;

  @IsNumber()
  timeAllocated: number;

  @IsBoolean()
  isComplete: boolean;

  @IsBoolean()
  isHidden: boolean;

  constructor(data: ProjectDto) {
    this.id = data.id;
    this.orgId = data.orgId;
    this.name = data.name;
    this.creatorId = data.creatorId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.timeAllocated = data.timeAllocated;
    this.isComplete = data.isComplete;
    this.isHidden = data.isHidden;
  }
}

// Request DTOs
export class GetAllPropjectsDto {
  @IsUUID()
  userId = "";
}

export class GetProjectDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  projectId = "";
}

export class CreateProjectDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  orgId = "";

  @ValidateNested()
  @Type(() => NewProjectDto)
  newProject = NewProjectDto;
}

export class NewProjectDto {
  @IsString()
  @IsNotEmpty()
  name = "";

  @IsString()
  @IsNotEmpty()
  orgId = "";

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProjectDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  projectId = "";

  @ValidateNested()
  @Type(() => ProjectChangesDto)
  projectChanges = ProjectChangesDto;
}

export class ProjectChangesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isHidden = false;
}

export class DeleteProjectDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  projectId = "";
}
