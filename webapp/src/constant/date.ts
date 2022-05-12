import { generateTimeList } from '@suiji/utils'

export const TimeOptions = computed(() =>
  generateTimeList(60).map(item => ({ value: item })),
)
