import { ProjectDto } from '@tasktime/utils';
import { Project } from '../entities/project.entity';

export function projectToDto(project: Project): ProjectDto {
  return new ProjectDto({
    id: project.id,
    orgId: project.org.id,
    name: project.name,
    creatorId: project.creator.id,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    description: project.description,
    timeAllocated: project.timeAllocated,
    isComplete: project.isComplete,
    isHidden: project.isHidden,
  });
}
