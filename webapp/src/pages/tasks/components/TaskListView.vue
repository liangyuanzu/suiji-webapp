<script setup lang="ts">
import {
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { debounce, formatTime, isValidTime } from '@suiji/utils'
import type { Task } from '@suiji/apis/task/type'
import dayjs from 'dayjs'
import { useProjectStore } from '@/store/project'
import { useTaskStore, useTaskStoreWithOut } from '@/store/task'
import type { DateSelectPopoverConfirmParams, TaskDateOption, TaskOperation } from '@/types/task'
import { ProjectType } from '@/types/project'

const { getTaskCount } = useTaskStoreWithOut()
getTaskCount()

const { currentProject, inboxProject } = storeToRefs(useProjectStore())
const { tasks, currentTask } = storeToRefs(useTaskStore())

const taskTitle = ref<string>('')
const selectedKeys = ref<string[]>([])
const dateSelectPopoverVisible = ref<boolean>(false)

const taskDateOptions: Array<TaskDateOption> = [
  {
    title: '今天',
    icon: 'quick-today',
    handle: (id: string) => {
      const startTime = dayjs().startOf('day').unix()
      const endTime = dayjs().endOf('day').unix()

      const { editTask } = useTaskStoreWithOut()
      editTask({
        id,
        startTime,
        endTime,
      })
    },
  },
  {
    title: '明天',
    icon: 'quick-tomorrow',
    handle: (id: string) => {
      const startTime = dayjs().add(1, 'day').startOf('day').unix()
      const endTime = dayjs().add(1, 'day').endOf('day').unix()

      const { editTask } = useTaskStoreWithOut()
      editTask({
        id,
        startTime,
        endTime,
      })
    },
  },
  {
    title: '下周',
    icon: 'quick-nextweek',
    handle: (id: string) => {
      const startTime = dayjs().add(1, 'week').startOf('day').unix()
      const endTime = dayjs().add(1, 'week').endOf('day').unix()

      const { editTask } = useTaskStoreWithOut()
      editTask({
        id,
        startTime,
        endTime,
      })
    },
  },
  {
    title: '自定义',
    icon: 'contextmenu-custom',
    handle: () => {
      dateSelectPopoverVisible.value = true
    },
  },
]

const taskOperations: Array<TaskOperation> = [
  {
    title: '删除',
    icon: DeleteOutlined,
    handle: (id: string) => {
      const { removeTask } = useTaskStoreWithOut()
      removeTask({
        id,
      })
    },
  },
]

const inputPlaceholder = computed(() => (
  `添加任务至"${currentProject?.value?.id?.startsWith('smart-project') ? '收集箱' : currentProject?.value?.name ?? ''}"，回车即可保存`
))

watchEffect(() => {
  const projectId = currentProject?.value?.id
  if (!projectId) return

  if (projectId.startsWith('smart-project')) {
    if (projectId === 'smart-project-today') {
      const { getTodayTasks } = useTaskStoreWithOut()
      getTodayTasks()
    }
    else if (projectId === 'smart-project-last-seven-days') {
      const { getSevenDaysTasks } = useTaskStoreWithOut()
      getSevenDaysTasks()
    }
  }
  else {
    const { getTasks } = useTaskStoreWithOut()
    getTasks({ projectId })
  }
})

watch(tasks, () => {
  const { setCurrentTask } = useTaskStoreWithOut()
  setCurrentTask(null)
})

const handleAddTask = () => {
  const projectId = toRaw(currentProject?.value)?.id ?? ''

  const { addTask } = useTaskStoreWithOut()

  const params: any = {}
  params.projectId = projectId
  params.title = taskTitle.value

  if (projectId.startsWith('smart-project')) {
    params.projectId = toRaw(inboxProject.value)?.id ?? ''
    addTask(params, ProjectType.INBOX)
  }
  else {
    addTask(params, currentProject.value?.type)
  }

  taskTitle.value = ''
}

const handleTaskClick = ({ key }) => {
  const task = tasks.value.find((task: Task) => task.id === key)
  if (task) {
    const { setCurrentTask } = useTaskStoreWithOut()
    setCurrentTask(task)
  }
}

const taskSelected = (e, id: string) => {
  const checked = e?.target?.checked
  if (checked !== undefined) {
    const { editTask } = useTaskStoreWithOut()
    editTask({
      id,
      checked,
    })
  }
}

const handleTaskTitleChange = debounce((task) => {
  const { editTask } = useTaskStoreWithOut()
  editTask(task)
}, 500)

const handleDateClear = ({ id, startTime, endTime, remindTime }: Task) => {
  const params: Partial<Pick<Task, 'startTime' | 'endTime' | 'remindTime'>> = {}
  if (startTime) params.startTime = 0
  if (endTime) params.endTime = 0
  if (remindTime) params.remindTime = 0

  if (Object.keys(params).length > 0) {
    const { editTask } = useTaskStoreWithOut()
    editTask({
      id,
      ...params,
    })
  }

  dateSelectPopoverVisible.value = false
}

const handleDateConfirm = ({ startTime, endTime, remindTime }: DateSelectPopoverConfirmParams) => {
  const params: Partial<Pick<Task, 'startTime' | 'endTime' | 'remindTime'>> = {}
  if (startTime) params.startTime = startTime
  if (endTime) params.endTime = endTime
  if (remindTime) params.remindTime = remindTime

  if (Object.keys(params).length > 0) {
    const { editTask } = useTaskStoreWithOut()
    editTask({
      id: currentTask?.value?.id ?? '',
      ...params,
    })
  }

  dateSelectPopoverVisible.value = false
}
</script>

<template>
  <div>
    <header class="pt-16px pb-8px px-20px flex items-center">
      <div class="w-30px h-30px flex items-center justify-center mr-8px">
        <menu-fold-outlined class="!text-18px !text-gray-800 !text-opacity-60" />
      </div>
      <h5 class="text-24px m-0">
        {{ currentProject?.name ?? '' }}
      </h5>
    </header>

    <div class="pb-8px px-20px">
      <a-input
        v-model:value="taskTitle"
        size="large"
        class="!rounded !text-14px !leading-27px"
        :placeholder="inputPlaceholder"
        :bordered="false"
        :style="{ backgroundColor: 'rgba(25, 25, 25, 0.05)'}"
        @press-enter="handleAddTask"
      />
    </div>

    <div class="task-view-wrapper">
      <div v-if="tasks.length > 0" class="pl-12px task-view">
        <a-menu v-model:selectedKeys="selectedKeys" @click="handleTaskClick">
          <a-menu-item v-for="task in tasks" :key="task.id">
            <div class="flex items-center">
              <div class="flex items-center w-full pl-20px task-left">
                <a-checkbox v-model:checked="task.checked" class="!mr-8px" @change="taskSelected($event, task.id)" />
                <div class="task-input-container w-full flex items-center">
                  <a-input
                    v-model:value="task.title" :bordered="false" @change="handleTaskTitleChange({
                      id: task.id,
                      title: task.title,
                    })"
                  />
                  <svg-icon
                    v-if="task.remindTime && isValidTime(task.startTime, task.endTime)"
                    icon="timecard_remind"
                    :size="13"
                    color="#19191933"
                    class="mr-4px"
                  />
                  <span
                    v-if="task.startTime"
                    :style="{color: isValidTime(task.startTime, task.endTime) ? 'rgb(71,114,250)': 'rgb(224,49,49)'}"
                    class="text-12px leading-30px pr-4px"
                  >{{ formatTime(task.startTime) }}</span>
                </div>
              </div>

              <a-popover placement="bottomLeft" trigger="click" overlay-class-name="task-operate-popover" class="cursor-pointer">
                <template #content>
                  <div class="px-12px pb-6px border-b">
                    <span :style="{ color: '#19191966' }" class="text-12px">日期</span>
                    <div class="flex justify-between">
                      <a-tooltip v-for="item in taskDateOptions" :key="item.title" placement="bottom" :title="item.title">
                        <date-select-popover v-if="item.title === '自定义'" v-model:visible="dateSelectPopoverVisible" trigger="contextmenu" @clear="handleDateClear(task)" @confirm="handleDateConfirm">
                          <svg-icon :icon="item.icon" :size="29" class="cursor-pointer hover:(bg-gray-900 bg-opacity-5)" @click="item.handle(task.id)" />
                        </date-select-popover>
                        <svg-icon v-else :icon="item.icon" :size="29" class="cursor-pointer hover:(bg-gray-900 bg-opacity-5)" @click="item.handle(task.id)" />
                      </a-tooltip>
                    </div>
                  </div>
                  <div class="w-200px" :style="{ color: '#666' }">
                    <div
                      v-for="item in taskOperations"
                      :key="item.title"
                      class="cursor-pointer mb-4px px-16px leading-35px operational-item flex items-center"
                      @click="item.handle(task.id)"
                    >
                      <component :is="item.icon" :style="{ fontSize: '16px' }" class="mr-8px" />
                      <span class="leading-40px">{{ item.title }}</span>
                    </div>
                  </div>
                </template>
                <ellipsis-outlined class="ellipsis-icon !px-4px !text-gray-400 hover:(!text-dark-400)" />
              </a-popover>
            </div>
          </a-menu-item>
        </a-menu>
      </div>

      <div v-else class="empty-wrapper">
        <img src="@/assets/images/empty-default.png" class="w-160px h-160px my-0 mx-auto">
        <div class="text-16px mt-40px" :style="{ color: 'rgba(25,25,25,0.6)'}">
          没想好把任务安排在哪？可以先放这里
        </div>
        <div class="text-13px text-center leading-22px m-10px" :style="{ color: 'rgba(25,25,25,0.4)'}">
          在输入框中记下来
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.task-view-wrapper {
  position: relative;

  .task-view {
    :deep(.ant-menu) {
      border: unset;

      .ant-menu-item {
        background-color: unset;
        padding: 0 !important;
        margin: 0 !important;
        overflow: unset;

        .task-input-container {
          border-bottom-width: 1px;
        }
      }

      .ant-menu-item-selected {
        .task-left {
          background-color: rgba(71,114,250,0.1);
        }
      }

      .ant-menu-item-active {
        .ellipsis-icon {
          visibility: visible !important;
        }

        &:not(.ant-menu-item-selected){
          .task-left {
            background-color: rgba(71,114,250,0.05);
          }
        }
      }

      &:not(.ant-menu-item-active) {
        .ellipsis-icon {
          visibility: hidden;
        }
      }

      .ant-menu-item-selected, .ant-menu-item-active  {
        .task-input-container {
          border-bottom-color: transparent;
        }
      }
    }
  }

  .empty-wrapper {
    position: absolute;
    left: 50%;
    top: 80px;
    transform: translateX(-50%);
  }
}

</style>

<style lang="less">
.task-operate-popover {
  .ant-popover-arrow {
    display: none !important;
  }

  .ant-popover-inner {
    border-radius: 4px !important;

    .ant-popover-inner-content {
      padding-bottom: 0 !important;
      padding-left: 0;
      padding-right: 0;

      .operational-item {
        &:hover {
          background-color: rgba(71,114,250,0.05);
        }
      }
    }
  }
}
</style>
