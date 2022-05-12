export { Task } from '@suiji/apis/task/type'

export interface TaskDateOption {
  title: string
  icon: string
  handle: (id: string) => void
}

export interface TaskOperation {
  title: string
  icon: string | unknown
  handle: (id: string) => void
}

export interface DateSelectPopoverConfirmParams {
  startTime: number
  endTime: number
  remindTime?: number
}
