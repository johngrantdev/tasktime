import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { OrgMember } from './entities/orgMember.entity';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';
import { User } from '../../user/entities/user.entity';
import { Org } from '../entities/org.entity';

@Injectable()
export class OrgMemberService {
  constructor(
    private readonly em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async getOrgMember(userId: string, orgId: string): Promise<OrgMember> {
    const localEm = this.em.fork();
    const member = await localEm.findOne(OrgMember, {
      member: { id: userId },
      org: { id: orgId },
    });
    if (!member) {
      throw new Error(`${userId} not found.`);
    }
    return member;
  }

  async createOrgMember(userId: string, orgId: string, role: OrgMemberRole) {
    const localEm = this.em.fork();
    const userRef = localEm.getReference(User, userId);
    const orgRef = localEm.getReference(Org, orgId);
    const orgMember = new OrgMember(userRef, orgRef, role);
    await localEm.persist(orgMember).flush();
  }

  async removeOrgMember(
    userId: string,
    orgId: string,
    memberId: string,
  ): Promise<undefined> {
    const localEm = this.em.fork();
    const orgMember = await localEm.findOne(OrgMember, {
      member: memberId,
      org: orgId,
    });
    if (!orgMember) {
      throw new Error(`User with ID ${memberId} not found`);
    }
    await localEm.remove(orgMember).flush();
  }
}
