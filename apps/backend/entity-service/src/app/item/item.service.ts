import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from './event/itemCreated.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Item } from './entities/item.entity';
import { ItemRepository } from './repositories/item.repository';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { ItemMember } from './entities/itemMember.entity';
import { ItemMemberRole } from './enum/itemMemberRole.enum';
import {
  CreateItemDto,
  DeleteItemDto,
  ItemDto,
  UpdateItemDto,
} from '@tasktime/dto';
import { itemToDto } from './utils/itemToDto';

@Injectable()
export class ItemService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllItems(userId: string): Promise<ItemDto[]> {
    const itemMembers = await this.itemRepository.findItemsByMemberId(userId);
    const itemRefs = itemMembers.map((itemMember) => itemMember.item);
    const items = await this.itemRepository.find(itemRefs);
    return items.map((item) => itemToDto(item));
  }

  // todo add check user and role authorization
  async getItem(itemId: string): Promise<ItemDto> {
    try {
      return itemToDto(await this.itemRepository.findOneOrFail(itemId));
    } catch (error) {
      throw new NotFoundException('item not found');
    }
  }

  async createItem(data: CreateItemDto): Promise<ItemDto> {
    const userRef = this.em.getReference(User, data.userId);
    const projectRef = this.em.getReference(Project, data.projectId);
    const item = new Item(userRef, projectRef, data.newItem.name);
    await this.em.persistAndFlush(item);
    const itemRef = this.em.getReference(Item, item.id);
    const itemMember = new ItemMember(userRef, itemRef, ItemMemberRole.Owner);
    await this.em.persistAndFlush(itemMember);
    this.eventEmitter.emit(
      'item.created',
      new ItemCreatedEvent(
        item.id,
        data.projectId,
        item.createdAt,
        data.userId,
      ),
    );
    return itemToDto(item);
  }

  async updateItem(data: UpdateItemDto): Promise<ItemDto> {
    const item = await this.itemRepository.findOne(data.itemId);
    if (!item) {
      throw new Error(`${data.itemId} not found.`);
    }
    this.itemRepository.assign(item, new data.itemChanges());
    await this.em.persistAndFlush(item);
    return itemToDto(item);
  }

  async deleteItem(data: DeleteItemDto): Promise<undefined> {
    const itemMembers = await this.itemRepository.findMembersByItemId(
      data.itemId,
    );
    await this.em.removeAndFlush(itemMembers);
    const item = await this.itemRepository.findOne(data.itemId);
    if (!item) {
      throw new Error(`Item with ID ${data.itemId} not found`);
    }
    await this.em.removeAndFlush(item);

    // this.eventEmitter.emit(
    //   'item.deleted',
    //   new ItemDeletedEvent(
    //     itemId,
    //     item.project.toJSON().id,
    //     new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
    //     item.creator.toJSON().id,
    //   ),
    // );
  }

  async getMember(userId: string, itemId: string): Promise<ItemMember> {
    return await this.itemRepository.findItemMember(userId, itemId);
  }
}
