<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useTaskStore, useTaskStoreWithOut } from '@/store/task'

const { getMonthTasks } = useTaskStoreWithOut()
getMonthTasks({
  month: dayjs().format('YYYY-MM'),
})

const { monthTasks } = storeToRefs(useTaskStore())

const getListData = (value: Dayjs) => {
  if (!monthTasks) return []

  return monthTasks?.value?.[value.format('MM-DD')] ?? []
}

const handlePanelChange = (value: Dayjs) => {
  getMonthTasks({
    month: dayjs(value).format('YYYY-MM'),
  })
}
</script>

<template>
  <div class="h-screen calendar-container">
    <a-calendar class="h-full" @panel-change="handlePanelChange">
      <template #dateCellRender="{ current }">
        <div v-for="item in getListData(current)" :key="item.id" class="task mb-2px px-2px rounded">
          {{ item.title }}
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<style lang="less" scoped>
.calendar-container {
  .task {
    background-color: rgba(71, 114, 250, 0.56);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  :deep(.ant-picker-calendar-header) {
    .ant-picker-calendar-month-select {
      margin-right: 8px;
    }

    .ant-picker-calendar-mode-switch {
      display: none;
    }
  }

  :deep(.ant-picker-calendar-date-content) {
    height: 125px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
