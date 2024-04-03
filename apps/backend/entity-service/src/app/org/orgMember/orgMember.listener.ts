import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrgMemberService } from './orgMember.service';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';
import { OrgCreatedEvent } from '../event/orgCreated.event';

@Injectable()
export class OrgEventListeners {
  constructor(private readonly orgMemberService: OrgMemberService) {}

  @OnEvent('org.created')
  async handleOrgCreatedEvent(payload: OrgCreatedEvent) {
    // payload.userId is the org creator and therefore the default admin
    await this.orgMemberService.createOrgMember(
      payload.createdBy,
      payload.orgId,
      OrgMemberRole.Admin,
    );
  }
}
