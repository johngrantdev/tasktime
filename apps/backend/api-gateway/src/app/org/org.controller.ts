import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Inject,
} from '@nestjs/common';
import { CreateOrgDto } from './dto/createOrg.dto';
import { UpdateOrgDto } from './dto/updateOrg.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { API_PREFIX } from '../shared/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AllOrgsDto, OrgDto } from '@tasktime/dto';
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';

@Controller(`${API_PREFIX}/org`)
@ApiTags('org')
export class OrgController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy, // private itemAncestryService: ItemAncestryService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all organizations where user is a member' })
  @ApiResponse({
    status: 200,
    description: 'The organization...',
    type: OrgDto,
  })
  async getAllOrgs(@Req() req: AuthenticatedRequest): Promise<AllOrgsDto> {
    return await firstValueFrom(
      this.natClient.send<AllOrgsDto>('org.getAllOrgs', {
        userId: req.user.id,
      }),
    );
  }

  @Get(':orgId')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'The organization', type: OrgDto })
  async getOrg(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
  ): Promise<OrgDto> {
    return await firstValueFrom(
      this.natClient.send('org.getOrg', {
        userId: req.user.id,
        orgId: orgId,
      }),
    );
  }

  @Post()
  async createOrg(
    @Req() req: AuthenticatedRequest,
    @Body() newOrg: CreateOrgDto,
  ): Promise<OrgDto> {
    return await firstValueFrom(
      this.natClient.send('org.createOrg', {
        userId: req.user.id,
        newOrg: newOrg,
      }),
    );
  }

  // todo:
  // still no error when property is not in schema, just returns without changes.
  @Patch(':orgId')
  async updateOrg(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
    @Body() orgUpdates: UpdateOrgDto,
  ): Promise<OrgDto> {
    return await firstValueFrom(
      this.natClient.send('org.updateOrg', {
        userId: req.user.id,
        orgId: orgId,
        orgUpdates,
      }),
    );
  }

  @Delete(':orgId')
  async deleteOrg(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('org.deleteOrg', {
        userId: req.user.id,
        orgId: orgId,
      }),
    );
  }

  /*    :orgId/member    */

  @Post(':orgId/member/acceptInvite')
  async acceptInvite(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('org.acceptOrgInvite', {
        userId: req.user.id,
        orgId: orgId,
      }),
    );
  }

  @Get(':orgId/member/:memberId')
  async getMember(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('org.getOrgMember', {
        userId: req.user.id,
        memberId: memberId,
        orgId: orgId,
      }),
    );
  }

  @Delete(':orgId/member/:memberId')
  async removeMember(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('org.removeOrgMember', {
        userId: req.user.id,
        memberId: memberId,
        orgId: orgId,
      }),
    );
  }
}
