import { Entity, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';

@Entity()
export class User extends CustomBaseEntity {
  @Property()
  email: string;

  @Property()
  firstName = '';

  @Property()
  lastName = '';

  // link to image
  @Property()
  avatar = '';

  @Property()
  lastLoginAt: Date = new Date();

  @Property({ type: 'boolean' })
  disabled = false;

  @Property()
  revocationTimestamp: Date = new Date();

  constructor(email: string) {
    super();
    this.email = email;
  }
}
