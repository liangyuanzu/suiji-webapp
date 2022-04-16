import type { GlobConfig, GlobEnvConfig } from '@suiji/types'
import { getAppConfigFileName } from '@suiji/utils'
import { version } from '../../package.json'

export const getAppConfig = () => {
  const ENV_NAME = getAppConfigFileName(import.meta.env)

  // Get the global configuration (the configuration will be extracted independently when packaging)
  const ENV = (
    import.meta.env.DEV
      ? (import.meta.env as any)
      : window[ENV_NAME]
  ) as GlobEnvConfig

  return ENV
}

export const getGlobalConfig = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_API_URL_PREFIX,
  } = getAppConfig()

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    apiUrl: VITE_GLOB_API_URL,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
  }
  return glob as Readonly<GlobConfig>
}

export const createStorageKeyPrefix = () => {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppConfig()
  return `${VITE_GLOB_APP_SHORT_NAME}_${import.meta.env.MODE}`.toUpperCase()
}
// Generate cache key according to version
export const createStorageName = () => {
  return `${createStorageKeyPrefix()}${`_${version}`}_`.toUpperCase()
}
