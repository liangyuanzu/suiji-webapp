import dayjs from 'dayjs'
import isYesterday from 'dayjs/plugin/isYesterday'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isYesterday)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isBetween)

export const formatTime = (timestamp: number, isDetailed?: boolean): string => {
  const time = dayjs.unix(timestamp)

  const getText = (text: string): string => isDetailed ? time.format(`${text},HH:mm`) : text

  if (dayjs(time).isYesterday()) return getText('昨天')
  if (dayjs(time).isToday()) return getText('今天')
  if (dayjs(time).isTomorrow()) return getText('明天')

  const nextDay = dayjs().add(1, 'week').startOf('day')
  if (dayjs(time).isBetween(dayjs(), nextDay)) {
    const weekNameArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return getText(weekNameArr[time.day()])
  }

  if (time.year() === dayjs().year()) return getText(time.format('M月D日'))

  return getText(time.format('YYYY年M月D日'))
}

export const isValidTime = (startTime: number, endTime: number): boolean => {
  if (dayjs().isBefore(dayjs.unix(startTime))) return true

  return dayjs().isBetween(dayjs.unix(startTime), dayjs.unix(endTime))
}
