import type { LocaleSetting, LocaleType } from '@suiji/types'

export const LOCALE: { [key: string]: LocaleType } = {
  zh: 'zh_CN',
  en: 'en',
}

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.zh,
  // Default locale
  fallback: LOCALE.zh,
  // available Locales
  availableLocales: [LOCALE.zh, LOCALE.en],
}
