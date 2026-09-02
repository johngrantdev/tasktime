import { Migration } from '@mikro-orm/migrations';

export class Migration20260902022844 extends Migration {
  override name = 'Migration20260902022844';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "org" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(255) not null default '', "disabled" boolean not null default false, primary key ("id"));`,
    );

    this.addSql(
      `create table "user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "first_name" varchar(255) not null default '', "last_name" varchar(255) not null default '', "avatar" varchar(255) not null default '', "last_login_at" timestamptz not null, "disabled" boolean not null default false, "revocation_timestamp" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "project" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "org_id" uuid not null, "name" varchar(255) not null, "creator_id" uuid not null, "description" varchar(255) not null default '', "time_allocated" int not null default 0, "is_complete" boolean not null default false, "is_hidden" boolean not null default false, primary key ("id"));`,
    );

    this.addSql(
      `create table "project_member" ("id" uuid not null default uuid_generate_v4(), "project_id" uuid not null, "member_id" uuid not null, "role" text not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "project_member" add constraint "project_member_role_check" check ("role" in ('projectAdmin', 'projectMember', 'projectViewer'));`,
    );

    this.addSql(
      `create table "org_member" ("id" uuid not null default uuid_generate_v4(), "org_id" uuid not null, "member_id" uuid not null, "role" text not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "org_member" add constraint "org_member_role_check" check ("role" in ('orgAdmin', 'orgProjectManager', 'orgMember'));`,
    );

    this.addSql(
      `create table "notification" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "read" boolean not null default false, "title" varchar(255) not null, "data" varchar(255) not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "item" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "project_id" uuid not null, "host_item_id" uuid null, "name" varchar(255) not null, "creator_id" uuid not null, "description" varchar(255) not null default '', "time_allocated" int not null default 0, "time_spent" int not null default 0, "is_complete" boolean not null default false, "req_review" boolean not null default false, "colour" varchar(255) not null default '', primary key ("id"));`,
    );

    this.addSql(
      `create table "item_member" ("id" uuid not null default uuid_generate_v4(), "item_id" uuid not null, "member_id" uuid not null, "role" text not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "item_member" add constraint "item_member_role_check" check ("role" in ('itemOwner', 'itemMember', 'itemReviewer', 'itemViewer'));`,
    );

    this.addSql(
      `create table "item_ancestry" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "ancestor_id" uuid not null, "descendant_id" uuid not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "project" add constraint "project_org_id_foreign" foreign key ("org_id") references "org" ("id");`,
    );
    this.addSql(
      `alter table "project" add constraint "project_creator_id_foreign" foreign key ("creator_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id");`,
    );
    this.addSql(
      `alter table "project_member" add constraint "project_member_member_id_foreign" foreign key ("member_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "org_member" add constraint "org_member_org_id_foreign" foreign key ("org_id") references "org" ("id");`,
    );
    this.addSql(
      `alter table "org_member" add constraint "org_member_member_id_foreign" foreign key ("member_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "item" add constraint "item_project_id_foreign" foreign key ("project_id") references "project" ("id");`,
    );
    this.addSql(
      `alter table "item" add constraint "item_host_item_id_foreign" foreign key ("host_item_id") references "item" ("id") on delete set null;`,
    );
    this.addSql(
      `alter table "item" add constraint "item_creator_id_foreign" foreign key ("creator_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "item_member" add constraint "item_member_item_id_foreign" foreign key ("item_id") references "item" ("id");`,
    );
    this.addSql(
      `alter table "item_member" add constraint "item_member_member_id_foreign" foreign key ("member_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "item_ancestry" add constraint "item_ancestry_ancestor_id_foreign" foreign key ("ancestor_id") references "item" ("id");`,
    );
    this.addSql(
      `alter table "item_ancestry" add constraint "item_ancestry_descendant_id_foreign" foreign key ("descendant_id") references "item" ("id");`,
    );
  }
}
