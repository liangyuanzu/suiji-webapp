<script setup lang="ts">
import { useLocale } from '@suiji/locale'
import {
  GetRemindTasksApi,
} from '@suiji/apis/task'
import type { Task } from '@suiji/apis/task/type'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useMessage } from '@/hooks/web/useMessage'

dayjs.extend(isBetween)

// support Multi-language
const { getLocale } = useLocale()

// Dynamic switch component library language
const locale = asyncComputed(async() => {
  const message = {
    zh_CN: () => {
      import('dayjs/locale/zh-cn')
      return import('ant-design-vue/es/locale/zh_CN')
    },
    en_US: () => {
      import('dayjs/locale/en')
      return import('ant-design-vue/es/locale/en_US')
    },
  }
  const mod = await message[getLocale.value]()

  return mod?.default ?? mod
})

const token = localStorage.getItem('token') ?? ''
const path = location.pathname

// 任务时间提醒
if (token && !(path === '/signup' || path === '/signin' || path.startsWith('/sign'))) {
  const wait = 1000

  useIntervalFn(async() => {
    const tasks = await GetRemindTasksApi()

    if (tasks.length > 0) {
      const needRemindTasks = tasks.filter((task: Task) => {
        const { remindTime } = task
        return dayjs.unix(remindTime).isBetween(dayjs().subtract(wait, 'ms'), dayjs().add(wait, 'ms'))
      })

      needRemindTasks.forEach((task: Task) => {
        const { createInfoModal } = useMessage()
        createInfoModal({
          title: task.title,
          content: task.content,
          okText: '我知道了',
          mask: false,
          centered: false,
        })
      })
    }
  }, wait, { immediate: true })
}

</script>

<template>
  <a-config-provider :locale="locale">
    <app-provider>
      <router-view />
    </app-provider>
  </a-config-provider>
</template>

<style lang="less">
.global-remind-modal {
  .ant-modal-body {
    .ant-modal-confirm-body {
      max-height: 300px;
      overflow-y: auto;

      .ant-modal-confirm-content {
        // margin-left: 0 !important;
      }

      .ant-modal-confirm-title, .ant-modal-confirm-content {
        // padding-left: 10px;
        // padding-right: 10px;
      }
    }

    .modal-icon-info {
      // display: none;
    }
  }
}
</style>
