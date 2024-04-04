import { IProject } from './project.interface'

export interface IOrg {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
  disabled: boolean
  projects?: Array<IProject>
}
