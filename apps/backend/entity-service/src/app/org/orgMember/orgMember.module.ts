import { Module } from '@nestjs/common';
import { OrgMember } from './entities/orgMember.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrgMemberService } from './orgMember.service';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMember])],
  providers: [OrgMemberService],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
