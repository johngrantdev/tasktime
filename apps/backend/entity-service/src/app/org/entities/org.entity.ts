import { Entity, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';

@Entity()
export class Org extends CustomBaseEntity {
  @Property()
  name = 'New Organisation';

  @Property()
  description = '';

  @Property({ type: 'boolean' })
  disabled = false;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
