import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from './event/itemCreated.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { ItemMember } from './entities/itemMember.entity';
import { ItemMemberRole } from './enum/itemMemberRole.enum';
import {
  CreateItemDto,
  DeleteItemDto,
  ItemDto,
  UpdateItemDto,
} from 'tasktime-utils';
import { itemToDto } from './utils/itemToDto';

@Injectable()
export class ItemService {
  constructor(
    private readonly em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllItems(userId: string): Promise<ItemDto[]> {
    const localEm = this.em.fork();
    const itemMembers = await localEm.find(ItemMember, { member: userId });
    const itemRefs = itemMembers.map((itemMember) => itemMember.item);
    const items = await localEm.find(Item, itemRefs);
    return items.map((item) => itemToDto(item));
  }

  // todo add check user and role authorization
  async getItem(itemId: string): Promise<ItemDto> {
    const localEm = this.em.fork();
    try {
      return itemToDto(await localEm.findOneOrFail(Item, itemId));
    } catch (_error) {
      throw new NotFoundException('item not found');
    }
  }

  async createItem(data: CreateItemDto): Promise<ItemDto> {
    const localEm = this.em.fork();
    const userRef = localEm.getReference(User, data.userId);
    const projectRef = localEm.getReference(Project, data.projectId);
    const item = new Item(userRef, projectRef, data.newItem.name);
    await localEm.persist(item).flush();
    const itemMember = new ItemMember(userRef, item, ItemMemberRole.Owner);
    await localEm.persist(itemMember).flush();
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
    const localEm = this.em.fork();
    const item = await localEm.findOne(Item, data.itemId);
    if (!item) {
      throw new Error(`${data.itemId} not found.`);
    }
    localEm.assign(item, data.itemChanges);
    await localEm.persist(item).flush();
    return itemToDto(item);
  }

  async deleteItem(data: DeleteItemDto): Promise<undefined> {
    const localEm = this.em.fork();
    const itemMembers = await localEm.find(ItemMember, { item: data.itemId });
    await localEm.remove(itemMembers).flush();
    const item = await localEm.findOne(Item, data.itemId);
    if (!item) {
      throw new Error(`Item with ID ${data.itemId} not found`);
    }
    await localEm.remove(item).flush();

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
    const localEm = this.em.fork();
    const itemMember = await localEm.findOne(ItemMember, {
      member: userId,
      item: itemId,
    });
    if (!itemMember) {
      throw new Error(`${itemId} not found.`);
    }
    return itemMember;
  }
}
