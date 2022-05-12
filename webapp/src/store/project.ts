import { acceptHMRUpdate, defineStore } from 'pinia'
import type { CreateProjectReq, CreateProjectResp, DeleteProjectReq, Project, UpdateProjectReq } from '@suiji/apis/project/type'
import { ProjectType } from '@suiji/apis/project/type'
import { CreateProjectApi, DeleteProjectApi, GetProjectsApi, UpdateProjectApi } from '@suiji/apis/project'
import { pinia } from '@/internal'
import { useTaskStore } from '@/store/task'

type CurrentProject = Pick<Project, 'id' | 'name' | 'type'> | null

interface ProjectState {
  inboxProject: Project | null
  normalProjects: Array<Project>
  currentProject: CurrentProject
}

export const useProjectStore = defineStore({
  id: 'project',

  persist: {
    strategies: [
      {
        paths: ['inboxProject', 'normalProjects'],
      },
    ],
  },

  state: (): ProjectState => ({
    inboxProject: null,
    normalProjects: [],
    currentProject: null,
  }),

  getters: {
  },

  actions: {
    setInbox(inbox: Project) {
      this.inboxProject = inbox
    },

    setNormal(normal: Array<Project>) {
      this.normalProjects = normal
    },

    addNormal(project: Project) {
      this.normalProjects.unshift(project)
    },

    findNormal(id: string) {
      return this.normalProjects.find((project: Project) => project.id === id)
    },

    incNormalTaskCount(id: string) {
      const item = this.findNormal(id)
      if (item) item.taskCount++
    },

    decNormalTaskCount(id: string) {
      const item = this.findNormal(id)
      if (item) item.taskCount--
    },

    setCurrent(current: CurrentProject) {
      this.currentProject = current
    },

    async addProject({ name, type }: CreateProjectReq) {
      try {
        const params: CreateProjectReq = { name }
        if (type) params.type = type

        const project: CreateProjectResp = await CreateProjectApi(params)
        if (type === ProjectType.INBOX) this.setInbox(project)
        else this.addNormal(project)
      }
      catch (err) {
        console.error(err)
      }
    },

    async editProject({ id, name }: UpdateProjectReq) {
      try {
        await UpdateProjectApi({ id, name })
        const item = this.findNormal(id)
        if (item) item.name = name
      }
      catch (err) {
        console.error(err)
      }
    },

    async removeProject({ id }: DeleteProjectReq) {
      try {
        await DeleteProjectApi({ id })
        const index = this.normalProjects.findIndex((project: Project) => project.id === id)
        if (index > -1) this.normalProjects.splice(index, 1)

        const { resetTasks } = useTaskStore()
        resetTasks()
      }
      catch (err) {
        console.error(err)
      }
    },

    async getProjects() {
      try {
        const { inbox, normal } = await GetProjectsApi()
        this.setInbox(inbox)
        this.setNormal(normal)
      }
      catch (err) {
        console.error(err)
      }
    },

  },
})

export function useProjectStoreWithOut() {
  return useProjectStore(pinia)
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
