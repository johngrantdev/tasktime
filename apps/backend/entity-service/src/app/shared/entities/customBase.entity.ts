import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity({ abstract: true })
export abstract class CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
