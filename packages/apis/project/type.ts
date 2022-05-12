export const enum ProjectType {
  INBOX = 'inbox',
  NORMAL = 'normal'
}

export interface Project {
  id: string
  name: string
  taskCount: number
  type: ProjectType
}

export interface CreateProjectReq {
  name: string
  type?: ProjectType
}

export type CreateProjectResp = Project

export interface UpdateProjectReq {
  id: string
  name: string
}

export type UpdateProjectResp = Project

export interface DeleteProjectReq {
  id: string
}

export interface GetProjectsResp {
  inbox: Project
  normal: Array<Project>
}
