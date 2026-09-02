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
import { ApiTags } from '@nestjs/swagger';
import { API_PREFIX } from '../shared/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';
import { ProjectDto, NewProjectDto, ProjectChangesDto } from 'tasktime-utils';

@Controller(`${API_PREFIX}/project`)
@ApiTags('project')
export class ProjectController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy,
  ) {}

  @Get()
  async getAllProjects(
    @Req() req: AuthenticatedRequest,
  ): Promise<Record<string, ProjectDto[]>> {
    return await firstValueFrom(
      this.natClient.send('project.getAllProjects', { userId: req.user.id }),
    );
  }

  @Get(':projectId')
  async getProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('project.getProject', {
        userId: req.user.id,
        projectId: projectId,
      }),
    );
  }

  @Post()
  async createProject(
    @Req() req: AuthenticatedRequest,
    @Body() newProject: NewProjectDto,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('project.createProject', {
        userId: req.user.id,
        orgId: newProject.orgId,
        newProject: newProject,
      }),
    );
  }

  @Patch(':projectId')
  async updateProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Body() changes: ProjectChangesDto,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('project.updateProject', {
        userId: req.user.id,
        projectId: projectId,
        projectChanges: changes,
      }),
    );
  }

  @Delete(':projectId')
  async deleteProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('project.deleteProject', {
        userId: req.user.id,
        projectId: projectId,
      }),
    );
  }
}
