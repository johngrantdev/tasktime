import { Injectable } from '@nestjs/common';
import { IOrgServiceUpdates } from './interface/org.interface';
import { CreateOrgDto } from './dto/createOrg.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from './event/orgCreated.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Org } from './entities/org.entity';
import { OrgMember } from './orgMember/entities/orgMember.entity';
import { OrgDto } from 'tasktime-utils';
import { orgToDto } from './utils/orgToDto';

@Injectable()
export class OrgService {
  constructor(
    private readonly em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllOrgs(userId: string): Promise<OrgDto[]> {
    const localEm = this.em.fork();
    const orgMembers = await localEm.find(OrgMember, {
      member: userId,
    });
    const orgRefs = orgMembers.map((orgMember) => orgMember.org);
    const orgs = await localEm.find(Org, orgRefs);
    return orgs.map((org) => orgToDto(org));
  }

  async getOrg(orgId: string): Promise<OrgDto> {
    const localEm = this.em.fork();
    const org = await localEm.findOne(Org, orgId);
    if (!org) {
      throw new Error(`${orgId} not found.`);
    }
    return orgToDto(org);
  }

  async createOrg(userId: string, newOrg: CreateOrgDto): Promise<OrgDto> {
    const localEm = this.em.fork();
    const org = new Org(newOrg.name);
    await localEm.persist(org).flush();
    // event triggers
    // - create orgMember
    this.eventEmitter.emit(
      'org.created',
      new OrgCreatedEvent(org.id, org.name, org.createdAt, userId),
    );
    return orgToDto(org);
  }

  async updateOrg(
    orgId: string,
    orgUpdates: IOrgServiceUpdates,
  ): Promise<OrgDto> {
    const localEm = this.em.fork();
    const org = await localEm.findOne(Org, orgId);
    if (!org) {
      throw new Error(`${orgId} not found.`);
    }
    localEm.assign(org, orgUpdates);
    this.em.persist(org).flush();
    return orgToDto(org);
  }

  //
  async deleteOrg(orgId: string): Promise<undefined> {
    const localEm = this.em.fork();
    const orgMembers = await localEm.find(OrgMember, { org: orgId });
    await localEm.remove(orgMembers).flush();
    const org = await localEm.findOne(Org, orgId);
    if (!org) {
      throw new Error(`Project with ID ${orgId} not found`);
    }
    await localEm.remove(org).flush();
  }
}
