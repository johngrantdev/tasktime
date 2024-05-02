import { ItemDto } from 'tasktime-utils';
import { Item } from '../entities/item.entity';

export function itemToDto(item: Item): ItemDto {
  const dto = new ItemDto({
    id: item.id,
    projectId: item.project.id,
    hostItemId: item.hostItem ? item.hostItem.id : '',
    name: item.name,
    creatorId: item.creator.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    description: item.description,
    timeAllocated: item.timeAllocated,
    timeSpent: item.timeSpent,
    isComplete: item.isComplete,
    colour: item.colour,
  });
  return dto;
}
