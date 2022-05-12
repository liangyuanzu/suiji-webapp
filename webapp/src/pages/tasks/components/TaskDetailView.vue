<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { debounce, formatTime, isValidTime } from '@suiji/utils'
import type { Task, UpdateTaskReq } from '@suiji/apis/task/type'
import { useTaskStore, useTaskStoreWithOut } from '@/store/task'
import type { DateSelectPopoverConfirmParams } from '@/types/task'

const { tasks, currentTask } = storeToRefs(useTaskStore())

const taskTitle = ref<string>('')
const taskContent = ref<string>('')
const taskChecked = ref<boolean>(false)
const dateSelectPopoverVisible = ref<boolean>(false)

const timeColor = computed(() => {
  const { startTime, endTime } = currentTask.value ?? {}

  if (!startTime || !endTime) return '#19191966'
  if (isValidTime(startTime, endTime)) return '#4772fa'
  return '#e03131'
})

const taskTimeText = computed(() => {
  const { startTime, endTime } = currentTask?.value ?? {}

  if (!startTime || !endTime) return '设置日期'
  if (startTime === endTime) return formatTime(startTime, true)
  return `${formatTime(startTime, true)} - ${formatTime(endTime, true)}`
})

watchEffect(() => {
  if (currentTask?.value) {
    const { title, content, checked } = currentTask?.value || {}
    if (title !== undefined) taskTitle.value = title
    if (content !== undefined) taskContent.value = content
    if (checked !== undefined) taskChecked.value = checked
  }
  else {
    taskTitle.value = ''
    taskContent.value = ''
    taskChecked.value = false
  }
})

const handleTaskChange = debounce(({ title, content, checked }: Omit<UpdateTaskReq, 'id'>) => {
  if (!currentTask?.value) return

  const { editTask } = useTaskStoreWithOut()

  const params: UpdateTaskReq = { id: currentTask?.value?.id ?? '' }
  if (title) params.title = title
  if (content) params.content = content
  if (checked !== undefined) params.checked = checked

  editTask(params)
}, 500)

const handleDateClear = () => {
  const params: Partial<Pick<Task, 'startTime' | 'endTime' | 'remindTime'>> = {}
  const { startTime, endTime, remindTime } = currentTask.value ?? {}
  if (startTime) params.startTime = 0
  if (endTime) params.endTime = 0
  if (remindTime) params.remindTime = 0

  if (Object.keys(params).length > 0) {
    const { editTask } = useTaskStoreWithOut()
    editTask({
      id: currentTask?.value?.id ?? '',
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
  <div class="wrapper">
    <div v-if="currentTask">
      <header class="p-20px flex items-center border-b">
        <a-checkbox v-model:checked="taskChecked" class="!mr-8px" @change="handleTaskChange({checked: $event.target.checked})" />
        <a-divider type="vertical" />
        <date-select-popover v-model:visible="dateSelectPopoverVisible" @clear="handleDateClear" @confirm="handleDateConfirm">
          <div class="flex items-center cursor-pointer pr-5px rounded hover:( bg-dark-800 bg-opacity-5)" :style="{ color: timeColor }">
            <svg-icon icon="date-unselected" :size="26" />
            <span class="text-14px pl-5px"> {{ taskTimeText }}</span>
          </div>
        </date-select-popover>
      </header>

      <div class="content-view">
        <div class="pt-15px pb-10px pl-9px pr-20px">
          <a-input v-model:value="taskTitle" :bordered="false" class="!text-16px font-semibold" @change="handleTaskChange({title: taskTitle})" />
        </div>
        <div class="px-20px">
          <a-textarea v-model:value="taskContent" placeholder="描述" class="!pl-0" :rows="42" :bordered="false" @input="handleTaskChange({content: taskContent})" />
        </div>
      </div>
    </div>

    <div v-if="tasks.length > 0 && !currentTask" class="empty-wrapper">
      <img src="@/assets/images/empty-task-detail.png" class="w-160px h-160px">
      <div class="text-16px mt-33px" :style="{ color: 'rgba(25,25,25,0.6)'}">
        点击任务标题查看详情
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  position: relative;
  .empty-wrapper {
    position: absolute;
    left: 50%;
    top: 180px;
    transform: translateX(-50%);
  }
}

</style>
