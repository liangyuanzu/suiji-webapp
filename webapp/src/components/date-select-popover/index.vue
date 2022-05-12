<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { RecycleScroller } from 'vue-virtual-scroller'
import dayjs from 'dayjs'
import { TimeOptions } from '@/constant/date'
import type { DateSelectPopoverConfirmParams } from '@/types/task'

type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextmenu'
const props = defineProps<{
  trigger: {
    type: PopoverTrigger
    default: 'click'
  }
  onClear: () => void
  onConfirm: (params: DateSelectPopoverConfirmParams) => void
}>()

const enum DateType {
  DATE = 'date',
  PERIOD = 'period'
}

const type = ref<string>(DateType.DATE)
const date = ref<Dayjs>(dayjs())
const dateMode = ref<string>('month')
const selectedTime = ref<string>('')
const remindTime = ref<string>('')
const remindTimeLabel = ref<string>('')
const dateRange = ref<[Dayjs, Dayjs]>([dayjs(), dayjs()])
const allDayChecked = ref<boolean>(false)

const timeRange = computed(() => {
  if (type.value === DateType.DATE) {
    if (selectedTime.value) {
      const time = `${dayjs(date.value).format('YYYY-MM-DD')} ${selectedTime.value}`
      return [dayjs(time).startOf('minute').unix(), dayjs(time).startOf('minute').unix()]
    }
    return [dayjs(date.value).startOf('minute').unix(), dayjs(date.value).startOf('minute').unix()]
  }
  else {
    const [startTime, endTime] = dateRange.value
    return [dayjs(startTime).startOf('minute').unix(), dayjs(endTime).startOf('minute').unix()]
  }
})

const RemindTimeOptions = computed(() => [
  {
    label: '准时',
    value: dayjs.unix(timeRange.value[0]).unix(),
  },
  {
    label: '提前 5 分钟',
    value: dayjs.unix(timeRange.value[0]).subtract(5, 'minute').unix(),
  },
  {
    label: '提前 30 分钟',
    value: dayjs.unix(timeRange.value[0]).subtract(30, 'minute').unix(),
  },
  {
    label: '提前 1 小时',
    value: dayjs.unix(timeRange.value[0]).subtract(1, 'hour').unix(),
  },
  {
    label: '提前 1 天',
    value: dayjs.unix(timeRange.value[0]).subtract(1, 'day').unix(),
  },
])

watch(type, () => {
  remindTime.value = ''
  remindTimeLabel.value = ''
})

const handleTimeItemClick = ({ key }) => {
  selectedTime.value = key
}

const handleRemindTimeItemClick = ({ key }) => {
  remindTime.value = String(key.value)
  remindTimeLabel.value = key.label
}

const handleAllDayChange = () => {
  if (allDayChecked.value)
    dateRange.value = [dayjs(dayjs().startOf('day')), dayjs(dayjs().endOf('day'))]

  else
    dateRange.value = [dayjs(), dayjs()]
}

const resetState = () => {
  type.value = DateType.DATE
  date.value = dayjs()
  dateMode.value = 'month'
  selectedTime.value = ''
  remindTime.value = ''
  remindTimeLabel.value = ''
  allDayChecked.value = false
}

const handleClear = () => {
  props.onClear()
  resetState()
}

const handleConfirm = () => {
  const [startTime, endTime] = timeRange.value
  const params: DateSelectPopoverConfirmParams = { startTime, endTime }
  if (remindTime.value) params.remindTime = Number(remindTime.value)

  props.onConfirm(params)
}
</script>

<template>
  <a-popover
    placement="bottomRight"
    trigger="click"
    overlay-class-name="date-select-popover"
    class="cursor-pointer"
  >
    <template #content>
      <div :class="[type === DateType.DATE ? '!w-248px' : '!w-350px']">
        <div class="flex justify-center">
          <a-radio-group v-model:value="type" class="m-auto">
            <a-radio-button :value="DateType.DATE" class="!rounded-full">
              日期
            </a-radio-button>

            <a-radio-button :value="DateType.PERIOD" class="!ml-8px !rounded-full">
              时间段
            </a-radio-button>
          </a-radio-group>
        </div>

        <div v-if="type === DateType.DATE">
          <a-calendar v-model:value="date" :fullscreen="false" />

          <a-dropdown placement="bottom" :trigger="['click']" overlay-class-name="time-dropdown">
            <a-button block class="my-4px">
              <div v-if="selectedTime">
                {{ selectedTime }}
              </div>
              <template v-if="!selectedTime" #icon>
                <svg-icon icon="timecard_time" class="inline-block" />
              </template>
              <span v-if="!selectedTime" class="text-13px ml-6px" :style="{color: 'rgba(25,25,25,0.6)'}">时间</span>
            </a-button>

            <template #overlay>
              <a-menu @click="handleTimeItemClick">
                <RecycleScroller
                  v-slot="{ item }"
                  class="h-232px overflow-y-scroll"
                  :items="TimeOptions"
                  :item-size="32"
                  key-field="value"
                >
                  <a-menu-item :key="item.value">
                    <div class="cursor-pointer leading-30px">
                      {{ item.value }}
                    </div>
                  </a-menu-item>
                </RecycleScroller>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <div v-else class="mt-13px">
          <a-range-picker
            v-model:value="dateRange"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
          />

          <a-checkbox v-model:checked="allDayChecked" class="!mt-8px !mb-17px" @change="handleAllDayChange">
            全天
          </a-checkbox>
        </div>

        <a-dropdown placement="bottom" :trigger="['click']" overlay-class-name="time-dropdown">
          <a-button block class="my-4px">
            <div v-if="remindTime">
              {{ remindTimeLabel }}
            </div>
            <template v-if="!remindTime" #icon>
              <svg-icon icon="timecard_remind" class="inline-block" color="#19191966" />
            </template>
            <span v-if="!remindTime" class="text-13px ml-6px" :style="{color: 'rgba(25,25,25,0.6)'}">提醒</span>
          </a-button>

          <template #overlay>
            <a-menu @click="handleRemindTimeItemClick">
              <RecycleScroller
                v-slot="{ item }"
                class="h-170px overflow-y-scroll"
                :items="RemindTimeOptions"
                :item-size="32"
                key-field="value"
              >
                <a-menu-item :key="item">
                  <div class="cursor-pointer leading-30px">
                    {{ item.label }}
                  </div>
                </a-menu-item>
              </RecycleScroller>
            </a-menu>
          </template>
        </a-dropdown>

        <div class="pt-12px flex flex-row-reverse">
          <a-space>
            <a-button class="w-120px" @click="handleClear">
              清除
            </a-button>
            <a-button type="primary" class="w-120px" @click="handleConfirm">
              确定
            </a-button>
          </a-space>
        </div>
      </div>
    </template>

    <slot />
  </a-popover>
</template>

<style lang="less">
.date-select-popover {
  // width: 280px;

  .ant-popover-arrow {
    display: none !important;
  }

  .ant-popover-inner {
    border-radius: 4px !important;

    .ant-popover-inner-content {

      .ant-radio-button-wrapper {
        border-left-width: 1px !important;

        &:not(.ant-radio-button-wrapper-checked) {
          border-left: 1px solid #d9d9d9 !important;
        }

        &::before {
          display: none !important;
        }
      }

      .ant-radio-button-wrapper-checked {
        &:not(.ant-radio-button-wrapper-disabled) {
          border-color: #1890ff;
        }
      }
    }
  }

  .ant-picker-calendar-mode-switch {
    display: none;
  }
}

.time-dropdown {
  .time-item {
    .ant-dropdown-menu-item {
      // padding-left: 0;
      // padding-right: 0;
    }
  }
}
</style>
