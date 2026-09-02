import { Module } from '@nestjs/common';
import { OrgMember } from './entities/orgMember.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrgMemberService } from './orgMember.service';
import { OrgMemberController } from './orgMember.controller';
import { OrgEventListeners } from './orgMember.listener';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMember])],
  controllers: [OrgMemberController],
  providers: [OrgMemberService, OrgEventListeners],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
