import { Entity, Property } from '@mikro-orm/decorators/legacy';
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

  // Epoch means "no token revoked yet". Defaulting to the signup instant
  // revokes the access token issued in that same second, so a new user's
  // first request is denied.
  @Property()
  revocationTimestamp: Date = new Date(0);

  constructor(email: string) {
    super();
    this.email = email;
  }
}
