import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { OrgMemberModule } from '../org/orgMember/orgMember.module';
import { ProjectModule } from '../project/project.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [OrgMemberModule, ProjectModule, ItemModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
