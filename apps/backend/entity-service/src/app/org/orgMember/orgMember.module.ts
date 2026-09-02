import { Module } from '@nestjs/common';
import { OrgMember } from './entities/orgMember.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrgMemberService } from './orgMember.service';
import { OrgMemberController } from './orgMember.controller';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMember])],
  controllers: [OrgMemberController],
  providers: [OrgMemberService],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
