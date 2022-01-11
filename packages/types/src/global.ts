import type { VNodeChild, PropType as VuePropType } from 'vue'

declare global {
  type AnyFunction<T> = (...args: any[]) => T

  type Recordable<T = any> = Record<string, T>

  // vue
  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element
}
