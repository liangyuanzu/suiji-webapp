import type { VNodeChild, PropType as VuePropType } from 'vue'

declare global {
  type AnyFunction<T> = (...args: any[]) => T

  type Recordable<T = any> = Record<string, T>

  // vue
  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element

  interface ViteEnv {
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_PORT: number
    VITE_PUBLIC_PATH: string
    VITE_PROXY: [string, string][]
    VITE_USE_IMAGEMIN: boolean
    VITE_LEGACY: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_USE_PWA: boolean
  }
}
