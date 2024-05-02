import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrgMemberService } from './orgMember.service';
import { GetOrgMemberDto, RemoveOrgMemberDto } from 'tasktime-utils';

@Controller()
@ApiTags('org')
export class OrgMemberController {
  constructor(private readonly orgMemberService: OrgMemberService) {}

  /*    :orgId/member    */

  // @MessagePattern('org.acceptInvite')
  // async acceptInvite(@Payload() data) {
  //   await this.orgMemberService.acceptInvite(data.userId, data.orgId);
  // }

  @MessagePattern('org.getMember')
  async getMember(@Payload() data: GetOrgMemberDto) {
    return await this.orgMemberService.getOrgMember(data.memberId, data.orgId);
  }

  @MessagePattern('org.removeMember')
  async removeMember(@Payload() data: RemoveOrgMemberDto) {
    await this.orgMemberService.removeOrgMember(
      data.userId,
      data.orgId,
      data.memberId,
    );
  }
}
