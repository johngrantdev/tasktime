import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { Org } from './entities/org.entity';
import { OrgMember } from './orgMember/entities/orgMember.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrgMemberModule } from './orgMember/orgMember.module';

@Module({
  imports: [OrgMemberModule, MikroOrmModule.forFeature([Org, OrgMember])],
  controllers: [OrgController],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
