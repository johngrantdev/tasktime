import { Controller } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../shared/decorators/abilities.decorator';
import {
  CreateItemAbility,
  DeleteItemAbility,
  UpdateItemAbility,
  ViewItemAbility,
} from '../ability/ability.objects';
import { ItemAncestryService } from './itemAncestry.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateItemAncestryDto,
  CreateItemDto,
  DeleteItemAncestryDto,
  DeleteItemDto,
  GetAllItemsDto,
  GetItemDto,
  ItemAncestryRelationshipDto,
  ItemDescendantsDto,
  ItemDto,
  UpdateItemDto,
  getItemDescendantsDto,
} from 'tasktime-utils';

@Controller()
@ApiTags('item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private itemAncestryService: ItemAncestryService
  ) {}

  @MessagePattern('item.getAllItems')
  @CheckAbilities(new ViewItemAbility())
  async getAllItems(@Payload() data: GetAllItemsDto): Promise<ItemDto[]> {
    return await this.itemService.getAllItems(data.userId);
  }

  @MessagePattern('item.getItem')
  @CheckAbilities(new ViewItemAbility())
  async getItem(@Payload() data: GetItemDto): Promise<ItemDto> {
    return await this.itemService.getItem(data.itemId);
  }

  @MessagePattern('item.createItem')
  @CheckAbilities(new CreateItemAbility())
  async createItem(@Payload() data: CreateItemDto) {
    return await this.itemService.createItem(data);
  }

  @MessagePattern('item.updateItem')
  @CheckAbilities(new UpdateItemAbility())
  async updateItem(@Payload() data: UpdateItemDto) {
    return await this.itemService.updateItem(data);
  }

  @MessagePattern('item.deleteItem')
  @CheckAbilities(new DeleteItemAbility())
  async deleteItem(@Payload() data: DeleteItemDto) {
    return await this.itemService.deleteItem(data);
  }

  // Ancestry Related
  @MessagePattern('item.getDescendants')
  @CheckAbilities(new ViewItemAbility())
  async getItemDescendants(
    @Payload() data: getItemDescendantsDto
  ): Promise<ItemDescendantsDto> {
    return this.itemAncestryService.getItemDescendants(data);
  }

  @MessagePattern('item.createItemAncestry')
  @CheckAbilities(new CreateItemAbility())
  async createItemAncestry(
    @Payload() data: CreateItemAncestryDto
  ): Promise<ItemAncestryRelationshipDto> {
    return await this.itemAncestryService.createItemAncestry(data);
  }

  @MessagePattern('item.deleteItemAncestry')
  @CheckAbilities(new DeleteItemAbility())
  async deleteItemAncestry(
    @Payload() data: DeleteItemAncestryDto
  ): Promise<undefined> {
    await this.itemAncestryService.deleteItemAncestry(data);
  }
}
