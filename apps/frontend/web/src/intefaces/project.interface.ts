export interface IProject {
  id: string
  createdAt: string
  updatedAt: string
  org: string
  name: string
  creator: string
  description: string
  timeAllocated: string
  isComplete: boolean
  isHidden: boolean
}
