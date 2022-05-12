<script setup lang="ts">
import { createBEM } from '@suiji/utils'

const attrs = useAttrs()

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  color: {
    type: String,
    default: '',
  },
  spin: {
    type: Boolean,
    default: false,
  },
})

const [bem] = createBEM('svg-icon')

const symbolId = computed(() => `#${props.prefix}-${props.icon}`)

const classes = computed(() => {
  const cls = [bem(), unref(attrs).class]
  if (props.spin)
    cls.push(bem('spin'))

  return cls
})

const svgStyle = computed(() => {
  const { size, color } = props
  let _size = `${size}`
  _size = `${_size.replace('px', '')}px`
  return {
    width: _size,
    height: _size,
    color,
  }
})
</script>

<template>
  <svg :class="classes" :style="svgStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="less" scoped>
// @prefix-cls: ~'@{namespace}-svg-icon';

// .@{prefix-cls} {
//   display: inline-block;
//   overflow: hidden;
//   vertical-align: -0.15em;
//   fill: currentColor;

//   &__spin {
//     animation: loadingCircle 1s infinite linear;
//   }
// }
</style>
