import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

// Response Dto
export class ItemDto {
  @IsUUID()
  id: string;

  @IsUUID()
  projectId: string;

  @IsUUID()
  @IsOptional()
  hostItemId?: string;

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

  @IsNumber()
  timeSpent: number;

  @IsBoolean()
  isComplete: boolean;

  @IsString()
  colour: string;

  constructor(data: ItemDto) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.hostItemId = data.hostItemId;
    this.name = data.name;
    this.creatorId = data.creatorId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.timeAllocated = data.timeAllocated;
    this.timeSpent = data.timeSpent;
    this.isComplete = data.isComplete;
    this.colour = data.colour;
  }
}

// Request DTOs
export class GetAllItemsDto {
  @IsUUID()
  userId = "";
}

export class GetItemDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  itemId = "";
}

export class CreateItemDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  projectId = "";

  @ValidateNested()
  @Type(() => NewItemDto)
  newItem = NewItemDto;
}

export class NewItemDto {
  @IsString()
  @IsNotEmpty()
  name = "";

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  parentItem?: string;

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsOptional()
  @IsString()
  colour?: string;

  @IsOptional()
  @IsUUID()
  hostItem?: string;
}

export class UpdateItemDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  itemId = "";

  @ValidateNested()
  @Type(() => ItemChangesDto)
  itemChanges = ItemChangesDto;
}

export class ItemChangesDto {
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
  @IsNumber()
  timeSpent?: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  reqReview?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  colour?: string;

  @IsOptional()
  @IsUUID()
  hostItem?: string;
}

export class DeleteItemDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  itemId = "";
}

export class getItemDescendantsDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  itemId = "";

  @IsNumber()
  inputDepth = -1;
}

export class CreateItemAncestryDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  @IsNotEmpty()
  ancestorItemId = "";

  @IsUUID()
  @IsNotEmpty()
  descendantItemId = "";
}

export class DeleteItemAncestryDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  itemAncestryId = "";
}

// Response Dtos

export class ItemAncestryRelationshipDto {
  @IsUUID()
  @IsNotEmpty()
  ancestorItemId = "";

  @IsUUID()
  @IsNotEmpty()
  descendantItemId = "";
}

export class ItemDescendantsDto {
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  itemIds: ItemDto[] = [];

  @ValidateNested({ each: true })
  @Type(() => ItemAncestryRelationshipDto)
  relationships: ItemAncestryRelationshipDto[] = [];
}
