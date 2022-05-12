<script lang="ts">
import { computed, defineComponent, unref } from 'vue'
import { isFunction } from '@suiji/utils'
// import { useI18n } from '@suiji/locale'
import { useCountdown } from '@/hooks/component/useCountdown'
import { useRuleFormItem } from '@/hooks/component/useRuleFormItem'

const props = {
  // value: { type: [Object, Number, String, Array] },
  count: { type: Number, default: 60 },
  beforeStartFunc: {
    type: Function as PropType<() => Promise<boolean>>,
    default: null,
  },
}

export default defineComponent({
  name: 'CountButton',
  props,
  setup(props) {
    const { currentCount, isStart, start } = useCountdown(props.count)
    // const { t } = useI18n()

    const getButtonText = computed(() => {
      return !unref(isStart)
        ? '发送验证码'
        : `${unref(currentCount)}秒后重发`
    })

    // watchEffect(() => {
    //   props.value === undefined && reset()
    // })

    /**
     * @description: Judge whether there is an external function before execution, and decide whether to start after execution
     */
    async function handleStart() {
      const { beforeStartFunc } = props
      if (beforeStartFunc && isFunction(beforeStartFunc)) {
        try {
          const canStart = await beforeStartFunc()
          canStart && start()
        }
        catch (err) {
          console.error(err)
        }
      }
      else {
        start()
      }
    }

    const [state] = useRuleFormItem(props)

    return { handleStart, currentCount, getButtonText, isStart, state }
  },
})
</script>

<template>
  <a-button
    type="link"
    class="options-btn"
    v-bind="$attrs"
    :disabled="isStart"
    @click="handleStart"
  >
    {{ getButtonText }}
  </a-button>
</template>

<style lang="less" scoped>
.options-btn {
  padding: 0px;
  color: #4772fa;
  font-size: 13px;
}
</style>
