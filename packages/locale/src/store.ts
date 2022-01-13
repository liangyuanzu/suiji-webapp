import type { LocaleType } from '@suiji/types'

import { computed } from 'vue'
import { LOCALE_KEY } from '@suiji/tokens'
import { useLocalStorage } from '@vueuse/core'
import { localeSetting } from '@suiji/setting'

const store = useLocalStorage(LOCALE_KEY, localeSetting)

export const setLocale = (locale: LocaleType) => {
  store.value.locale = locale
}

export const getLocale = computed(() => store.value.locale)

export const showLocalePicker = computed(() => store.value.showPicker)
