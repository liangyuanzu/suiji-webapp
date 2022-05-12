import { request } from '@suiji/request'
import type {
  CreateProjectReq,
  CreateProjectResp,
  DeleteProjectReq,
  GetProjectsResp,
  UpdateProjectReq,
  UpdateProjectResp,
} from './type'

enum Api {
  CreateProject = '/createProject',
  UpdateProject = '/updateProject',
  DeleteProject = '/deleteProject',
  GetProjects = '/getProjects',
}

export const CreateProjectApi = (data: CreateProjectReq): Promise<CreateProjectResp> => {
  return request.post({ url: Api.CreateProject, data })
}

export const UpdateProjectApi = (data: UpdateProjectReq): Promise<UpdateProjectResp> => {
  return request.post({ url: Api.UpdateProject, data })
}

export const DeleteProjectApi = (data: DeleteProjectReq) => {
  return request.post({ url: Api.DeleteProject, data })
}

export const GetProjectsApi = (): Promise<GetProjectsResp> => {
  return request.get({ url: Api.GetProjects })
}
