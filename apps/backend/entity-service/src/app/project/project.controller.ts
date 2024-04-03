import { Controller } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../shared/decorators/abilities.decorator';
import {
  CreateProjectAbility,
  DeleteProjectAbility,
  UpdateProjectAbility,
  ViewProjectAbility,
} from '../ability/ability.objects';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectDto } from '@tasktime/dto';

@Controller()
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern('project.getAllProjects')
  // @CheckAbilities(new ViewProjectAbility())
  async getAllProjects(@Payload() data): Promise<ProjectDto[]> {
    return await this.projectService.getAllProjects(data.userId);
  }

  @MessagePattern('project.getProject')
  @CheckAbilities(new ViewProjectAbility())
  async getProject(@Payload() data): Promise<ProjectDto> {
    return await this.projectService.getProject(data.projectId);
  }

  @MessagePattern('project.createProject')
  @CheckAbilities(new CreateProjectAbility())
  async createProject(@Payload() data): Promise<ProjectDto> {
    return await this.projectService.createProject(
      data.userId,
      data.newProject
    );
  }

  @MessagePattern('project.updateProject')
  @CheckAbilities(new UpdateProjectAbility())
  async updateProject(@Payload() data): Promise<ProjectDto> {
    return await this.projectService.updateProject(
      data.projectId,
      data.projectUpdates
    );
  }

  @MessagePattern('project.deleteProject')
  @CheckAbilities(new DeleteProjectAbility())
  async deleteProject(@Payload() data) {
    await this.projectService.deleteProject(data.userId, data.projectId);
  }
}
