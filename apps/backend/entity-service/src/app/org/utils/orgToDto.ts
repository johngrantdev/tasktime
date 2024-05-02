import { OrgDto } from 'tasktime-utils';
import { Org } from '../entities/org.entity';

export function orgToDto(org: Org): OrgDto {
  return new OrgDto({
    id: org.id,
    name: org.name,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    description: org.description,
  });
}
