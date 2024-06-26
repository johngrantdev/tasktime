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
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';
import { ProjectDto, CreateProjectDto, UpdateProjectDto } from 'tasktime-utils';

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
      this.natClient.send('entity.getAllProjects', { userId: req.user.id }),
    );
  }

  @Get(':projectId')
  async getProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('entity.getProject', {
        userId: req.user.id,
        projectId: projectId,
      }),
    );
  }

  @Post()
  async createProject(
    @Req() req: AuthenticatedRequest,
    @Body() newProject: CreateProjectDto,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('entity.createProject', {
        userId: req.user.id,
        newProject: newProject,
      }),
    );
  }

  @Patch(':projectId')
  async updateProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Body() changes: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return await firstValueFrom(
      this.natClient.send('entity.updateProject', {
        userId: req.user.id,
        projectId: projectId,
        changes: changes,
      }),
    );
  }

  @Delete(':projectId')
  async deleteProject(
    @Req() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ) {
    return await firstValueFrom(
      this.natClient.send('entity.deleteProject', {
        userId: req.user.id,
        projectId: projectId,
      }),
    );
  }
}
