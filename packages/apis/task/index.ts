import { request } from '@suiji/request'
import type {
  CreateTaskReq,
  CreateTaskResp,
  DeleteTaskReq,
  GetMonthTasksReq,
  GetMonthTasksResp,
  GetRemindTasksResp,
  GetSevenDaysTaskCountResp,
  GetSevenDaysTasksResp,
  GetTasksReq,
  GetTasksResp,
  GetTodayTaskCountResp,
  GetTodayTasksResp,
  UpdateTaskReq,
  UpdateTaskResp,
} from './type'

enum Api {
  CreateTask = '/createTask',
  UpdateTask = '/updateTask',
  DeleteTask = '/deleteTask',
  GetTasks = '/getTasks',
  GetTodayTasks = '/getTodayTasks',
  GetSevenDaysTasks = '/getSevenDaysTasks',
  GetRemindTasks = '/getRemindTasks',
  GetMonthTasks = '/getMonthTasks',
  GetTodayTaskCount = '/getTodayTaskCount',
  GetSevenDaysTaskCount = '/getSevenDaysTaskCount',
}

export const CreateTaskApi = (data: CreateTaskReq): Promise<CreateTaskResp> => {
  return request.post({ url: Api.CreateTask, data })
}

export const UpdateTaskApi = (data: UpdateTaskReq): Promise<UpdateTaskResp> => {
  return request.post({ url: Api.UpdateTask, data })
}

export const DeleteTaskApi = (data: DeleteTaskReq) => {
  return request.post({ url: Api.DeleteTask, data })
}

export const GetTasksApi = (params: GetTasksReq): Promise<GetTasksResp> => {
  return request.get({ url: Api.GetTasks, params })
}

export const GetTodayTasksApi = (): Promise<GetTodayTasksResp> => {
  return request.get({ url: Api.GetTodayTasks })
}

export const GetSevenDaysTasksApi = (): Promise<GetSevenDaysTasksResp> => {
  return request.get({ url: Api.GetSevenDaysTasks })
}

export const GetRemindTasksApi = (): Promise<GetRemindTasksResp> => {
  return request.get({ url: Api.GetRemindTasks })
}

export const GetMonthTasksApi = (params: GetMonthTasksReq): Promise<GetMonthTasksResp> => {
  return request.get({ url: Api.GetMonthTasks, params })
}

export const GetTodayTaskCountApi = (): Promise<GetTodayTaskCountResp> => {
  return request.get({ url: Api.GetTodayTaskCount })
}

export const GetSevenDaysTaskCountApi = (): Promise<GetSevenDaysTaskCountResp> => {
  return request.get({ url: Api.GetSevenDaysTaskCount })
}
