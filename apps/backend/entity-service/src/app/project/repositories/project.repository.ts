import { EntityRepository } from '@mikro-orm/postgresql';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/projectMember.entity';

export class ProjectRepository extends EntityRepository<Project> {
  async findMembersByProjectId(projectId: string): Promise<ProjectMember[]> {
    return this.em.find(ProjectMember, { project: projectId });
  }

  async findProjectMember(
    userId: string,
    projectId: string,
  ): Promise<ProjectMember> {
    const projectMember = await this.em.findOne(ProjectMember, {
      member: userId,
      project: projectId,
    });

    if (!projectMember) {
      throw new Error(`${projectId} not found.`);
    }

    return projectMember;
  }

  async findProjectsByMemberId(userId: string): Promise<ProjectMember[]> {
    return await this.em.find(ProjectMember, {
      member: userId,
    });
  }
}
