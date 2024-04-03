import { EntityRepository } from '@mikro-orm/postgresql';
import { Item } from '../entities/item.entity';
import { ItemMember } from '../entities/itemMember.entity';

export class ItemRepository extends EntityRepository<Item> {
  async findMembersByItemId(itemId: string): Promise<ItemMember[]> {
    return this.em.find(ItemMember, { item: itemId });
  }

  async findItemMember(userId: string, itemId: string): Promise<ItemMember> {
    const itemMember = await this.em.findOne(ItemMember, {
      member: userId,
      item: itemId,
    });

    if (!itemMember) {
      throw new Error(`${itemId} not found.`);
    }

    return itemMember;
  }

  async findItemsByMemberId(userId: string): Promise<ItemMember[]> {
    return await this.em.find(ItemMember, {
      member: userId,
    });
  }
}
