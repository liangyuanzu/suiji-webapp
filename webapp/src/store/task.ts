import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import type {
  CreateTaskReq,
  CreateTaskResp,
  DeleteTaskReq,
  GetTasksReq,
  UpdateTaskReq,
} from '@suiji/apis/task/type'
import {
  CreateTaskApi,
  DeleteTaskApi,
  GetMonthTasksApi,
  GetSevenDaysTaskCountApi,
  GetSevenDaysTasksApi,
  GetTasksApi,
  GetTodayTaskCountApi,
  GetTodayTasksApi,
  UpdateTaskApi,
} from '@suiji/apis/task'
import { pinia } from '@/internal'
import { useProjectStore } from '@/store/project'
import type { Task } from '@/types/task'
import { ProjectType } from '@/types/project'

interface TaskState {
  tasks: Array<Task>
  monthTasks: {
    [propname: string]: Task[]
  } | null
  todayTaskCount: number
  sevenDaysTaskCount: number
  currentTask: Task | null
}

export const useTaskStore = defineStore({
  id: 'task',

  persist: {
    strategies: [
      {
        paths: ['task', 'todayTaskCount', 'sevenDaysTaskCount'],
      },
    ],
  },

  state: (): TaskState => ({
    tasks: [],
    monthTasks: null,
    todayTaskCount: 0,
    sevenDaysTaskCount: 0,
    currentTask: null,
  }),

  getters: {
  },

  actions: {
    findTask(id: string) {
      return this.tasks.find((task: Task) => task.id === id)
    },

    resetTasks() {
      this.tasks = []
    },

    setCurrentTask(current: Task | null) {
      this.currentTask = current
    },

    getTaskCount() {
      this.getTodayTaskCount()
      this.getSevenDaysTaskCount()
    },

    async addTask(data: CreateTaskReq, projectType?: ProjectType) {
      try {
        const task: CreateTaskResp = await CreateTaskApi(data)
        this.tasks.unshift(task)

        if (projectType === ProjectType.INBOX) {
          const { inboxProject } = storeToRefs(useProjectStore())
          if (inboxProject.value) inboxProject.value.taskCount++
        }
        else {
          const { incNormalTaskCount } = useProjectStore()
          incNormalTaskCount(data.projectId)
        }
      }
      catch (err) {
        console.error(err)
      }
    },

    async editTask({ id, title, content, checked, startTime, endTime, remindTime }: UpdateTaskReq) {
      try {
        const params: UpdateTaskReq = { id }
        if (title) params.title = title
        if (content !== undefined) params.content = content
        if (checked !== undefined) params.checked = checked
        if (startTime !== undefined) params.startTime = startTime
        if (endTime !== undefined) params.endTime = endTime
        if (remindTime !== undefined) params.remindTime = remindTime

        await UpdateTaskApi(params)

        const item = this.findTask(id)
        if (item) {
          if (title) item.title = title
          if (content !== undefined) item.content = content
          if (checked !== undefined) item.checked = checked
          if (startTime !== undefined) item.startTime = startTime
          if (endTime !== undefined) item.endTime = endTime
          if (remindTime !== undefined) item.remindTime = remindTime
        }

        this.getTaskCount()
      }
      catch (err) {
        console.error(err)
      }
    },

    async removeTask({ id }: DeleteTaskReq) {
      try {
        await DeleteTaskApi({ id })

        const index = this.tasks.findIndex((task: Task) => task.id === id)
        if (index > -1) {
          const { currentProject, inboxProject } = storeToRefs(useProjectStore())

          if (currentProject.value?.type === ProjectType.INBOX) {
            if (inboxProject.value) inboxProject.value.taskCount--
          }
          else {
            const item = this.findTask(id)

            if (item) {
              const { decNormalTaskCount } = useProjectStore()
              decNormalTaskCount(item.projectId)
            }
          }

          this.tasks.splice(index, 1)

          this.getTaskCount()
        }
      }
      catch (err) {
        console.error(err)
      }
    },

    async getTasks(params: GetTasksReq) {
      try {
        const tasks = await GetTasksApi(params)
        this.tasks = tasks
      }
      catch (err) {
        console.error(err)
      }
    },

    async getTodayTasks() {
      try {
        const tasks = await GetTodayTasksApi()
        this.tasks = tasks
        this.todayTaskCount = tasks.length ?? 0
      }
      catch (err) {
        console.error(err)
      }
    },

    async getSevenDaysTasks() {
      try {
        const tasks = await GetSevenDaysTasksApi()
        this.tasks = tasks
        this.sevenDaysTaskCount = tasks.length ?? 0
      }
      catch (err) {
        console.error(err)
      }
    },

    async getMonthTasks(params) {
      try {
        const monthTasks = await GetMonthTasksApi(params)
        this.monthTasks = monthTasks
      }
      catch (err) {
        console.error(err)
      }
    },

    async getTodayTaskCount() {
      try {
        const { count } = await GetTodayTaskCountApi()
        this.todayTaskCount = count ?? 0
      }
      catch (err) {
        console.error(err)
      }
    },

    async getSevenDaysTaskCount() {
      try {
        const { count } = await GetSevenDaysTaskCountApi()
        this.sevenDaysTaskCount = count ?? 0
      }
      catch (err) {
        console.error(err)
      }
    },
  },
})

export function useTaskStoreWithOut() {
  return useTaskStore(pinia)
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
