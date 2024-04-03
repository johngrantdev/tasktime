import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectDeletedEvent } from './event/projectDeleted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectRepository } from './repositories/project.repository';
import { Org } from '../org/entities/org.entity';
import { User } from '../user/entities/user.entity';
import { ProjectMember } from './entities/projectMember.entity';
import { ProjectMemberRole } from './enum/projectMemberRole.enum';
import { ProjectDto } from '@tasktime/dto';
import { projectToDto } from './utils/projectToDto';
import { CreateProjectDto, UpdateProjectDto } from '@tasktime/dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllProjects(userId: string): Promise<ProjectDto[]> {
    const projectMembers =
      await this.projectRepository.findProjectsByMemberId(userId);
    const projectRefs = projectMembers.map(
      (projectMember) => projectMember.project,
    );
    const projects = await this.projectRepository.find(projectRefs);

    return projects.map((project) => projectToDto(project));
  }

  async getProject(projectId: string): Promise<ProjectDto> {
    return projectToDto(await this.projectRepository.findOne(projectId));
  }

  async createProject(data: CreateProjectDto): Promise<ProjectDto> {
    const userRef: User = this.em.getReference(User, data.userId);
    const orgRef = this.em.getReference(Org, data.orgId);
    const project = new Project(userRef, orgRef, data.newProject.name);
    await this.em.persistAndFlush(project);
    const projectRef = this.em.getReference(Project, project.id);
    const projectMember = new ProjectMember(
      userRef,
      projectRef,
      ProjectMemberRole.Admin,
    );
    await this.em.persistAndFlush(projectMember);
    return projectToDto(project);
  }

  async updateProject(data: UpdateProjectDto): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne(data.projectId);
    this.projectRepository.assign(project, new data.projectChanges());
    return projectToDto(project);
  }

  async deleteProject(userId: string, projectId: string): Promise<undefined> {
    const projectMembers =
      await this.projectRepository.findMembersByProjectId(projectId);
    await this.em.removeAndFlush(projectMembers);
    const project = await this.projectRepository.findOne(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    await this.em.removeAndFlush(project);

    this.eventEmitter.emit(
      'project.deleted',
      new ProjectDeletedEvent(
        project.id,
        project.name,
        project.org.id,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        userId,
      ),
    );
  }

  async getMember(userId: string, projectId: string): Promise<ProjectMember> {
    return await this.projectRepository.findProjectMember(userId, projectId);
  }
}
