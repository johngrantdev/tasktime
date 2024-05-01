import { defineConfig } from '@mikro-orm/postgresql';

import { Item } from './item/entities/item.entity';
import { ItemMember } from './item/entities/itemMember.entity';
import { User } from './user/entities/user.entity';
import { Org } from './org/entities/org.entity';
import { OrgMember } from './org/orgMember/entities/orgMember.entity';
import { Project } from './project/entities/project.entity';
import { ProjectMember } from './project/entities/projectMember.entity';
import { CustomBaseEntity } from './shared/entities/customBase.entity';
import { Notification } from './notification/entities/notification.entity';
import { ItemAncestry } from './item/entities/itemAncestry.entity';

export default defineConfig({
  entities: [
    CustomBaseEntity,
    User,
    Org,
    OrgMember,
    Project,
    ProjectMember,
    Item,
    ItemMember,
    ItemAncestry,
    Notification,
  ],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});
