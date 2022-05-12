export interface Task {
  id: string
  projectId: string
  title: string
  content: string
  checked: boolean
  startTime: number
  endTime: number
  remindTime: number
}

export interface CreateTaskReq {
  projectId: string
  title: string
}

export type CreateTaskResp = Task

export interface UpdateTaskReq {
  id: string
  title?: string
  content?: string
  checked?: boolean
  startTime?: number
  endTime?: number
  remindTime?: number
}

export type UpdateTaskResp = Task

export interface DeleteTaskReq {
  id: string
}

export interface GetTasksReq {
  projectId: string
}

export type GetTasksResp = Array<Task>

export type GetTodayTasksResp = Array<Task>

export type GetSevenDaysTasksResp = Array<Task>

export type GetRemindTasksResp = Array<Task>

export interface TaskCount {
  count: number
}

export type GetTodayTaskCountResp = TaskCount

export type GetSevenDaysTaskCountResp = TaskCount

export interface GetMonthTasksReq {
  month: string
}

export interface GetMonthTasksResp {
  [propname: string]: Array<Task>
}
