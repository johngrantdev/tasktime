import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectDeletedEvent } from './event/projectDeleted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';
import { Org } from '../org/entities/org.entity';
import { User } from '../user/entities/user.entity';
import { ProjectMember } from './entities/projectMember.entity';
import { ProjectMemberRole } from './enum/projectMemberRole.enum';
import { ProjectDto } from 'tasktime-utils';
import { projectToDto } from './utils/projectToDto';
import { CreateProjectDto, UpdateProjectDto } from 'tasktime-utils';

@Injectable()
export class ProjectService {
  constructor(
    private readonly em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllProjects(userId: string): Promise<ProjectDto[]> {
    const localEm = this.em.fork();
    const projectMembers = await localEm.find(ProjectMember, {
      member: userId,
    });
    const projectRefs = projectMembers.map(
      (projectMember) => projectMember.project,
    );
    const projects = await localEm.find(Project, projectRefs);

    return projects.map((project) => projectToDto(project));
  }

  async getProject(projectId: string): Promise<ProjectDto> {
    const localEm = this.em.fork();
    const project = await localEm.findOne(Project, projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    return projectToDto(project);
  }

  async createProject(data: CreateProjectDto): Promise<ProjectDto> {
    const localEm = this.em.fork();
    const userRef: User = localEm.getReference(User, data.userId);
    const orgRef = localEm.getReference(Org, data.orgId);
    const project = new Project(userRef, orgRef, data.newProject.name);
    await localEm.persist(project).flush();
    const projectMember = new ProjectMember(
      userRef,
      project,
      ProjectMemberRole.Admin,
    );
    await localEm.persist(projectMember).flush();
    return projectToDto(project);
  }

  async updateProject(data: UpdateProjectDto): Promise<ProjectDto> {
    const localEm = this.em.fork();
    const project = await localEm.findOne(Project, data.projectId);
    if (!project) {
      throw new Error(`Project with ID ${data.projectId} not found`);
    }
    localEm.assign(project, data.projectChanges);
    await localEm.persist(project).flush();
    return projectToDto(project);
  }

  async deleteProject(userId: string, projectId: string): Promise<undefined> {
    const localEm = this.em.fork();
    const projectMembers = await localEm.find(ProjectMember, {
      project: projectId,
    });
    await localEm.remove(projectMembers).flush();
    const project = await localEm.findOne(Project, projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    await localEm.remove(project).flush();

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
    const localEm = this.em.fork();
    const projectMember = await localEm.findOne(ProjectMember, {
      member: userId,
      project: projectId,
    });
    if (!projectMember) {
      throw new Error(`${projectId} not found.`);
    }
    return projectMember;
  }
}
