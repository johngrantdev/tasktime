import { Controller } from '@nestjs/common';
import { OrgService } from './org.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../shared/decorators/abilities.decorator';
import {
  CreateOrgAbility,
  ViewOrgAbility,
  UpdateOrgAbility,
  DeleteOrgAbility,
} from '../ability/ability.objects';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AllOrgsDto,
  GetAllOrgsDto,
  GetOrgDto,
  CreateOrgDto,
  UpdateOrgDto,
  DeleteOrgDto,
  OrgDto,
} from '@tasktime/utils';

@Controller()
@ApiTags('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  // does not require guard as it contains logs to find the orgs that the
  // user is a member of.
  @MessagePattern('org.getAllOrgs')
  async getAllOrgs(@Payload() data: GetAllOrgsDto): Promise<AllOrgsDto> {
    console.log(data.userId);
    const orgs = await this.orgService.getAllOrgs(data.userId);
    return { orgs: orgs };
  }

  @MessagePattern('org.getOrg')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'The organization', type: OrgDto })
  @CheckAbilities(new ViewOrgAbility())
  async getOrg(@Payload() data: GetOrgDto): Promise<OrgDto> {
    return await this.orgService.getOrg(data.orgId);
  }

  @MessagePattern('org.createOrg')
  @CheckAbilities(new CreateOrgAbility())
  async createOrg(@Payload() data: CreateOrgDto): Promise<OrgDto> {
    return await this.orgService.createOrg(data.userId, data.newOrg);
  }

  // todo:
  // still no error when property is not in schema, just returns without changes.
  @MessagePattern('org.updateOrg')
  @CheckAbilities(new UpdateOrgAbility())
  async updateOrg(@Payload() data: UpdateOrgDto): Promise<OrgDto> {
    return await this.orgService.updateOrg(data.orgId, data.orgUpdates);
  }

  @MessagePattern('org.deleteOrg')
  @CheckAbilities(new DeleteOrgAbility())
  async deleteOrg(@Payload() data: DeleteOrgDto) {
    await this.orgService.deleteOrg(data.orgId);
  }
}
