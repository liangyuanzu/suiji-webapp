export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko'

export interface LocaleSetting {
  showPicker: boolean
  // Current language
  locale: LocaleType
  // default language
  fallback: LocaleType
  // available Locales
  availableLocales: LocaleType[]
}

export interface GlobConfig {
  // Site title
  title: string
  // Project abbreviation
  shortName: string
  // Service interface url
  apiUrl: string
  // Upload url
  uploadUrl?: string
  //  Service interface url prefix
  urlPrefix?: string
}

export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string
  // Service interface url
  VITE_GLOB_API_URL: string
  // Upload url
  VITE_GLOB_UPLOAD_URL?: string
  // Service interface url prefix
  VITE_GLOB_API_URL_PREFIX?: string
}

export interface ProjectConfig {
  // Theme color
  themeColor: string
}
