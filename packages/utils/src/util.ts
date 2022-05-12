/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export const setObjToUrlParams = (baseUrl: string, obj: any): string => {
  let parameters = ''
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')

  // The method /\?$/.test cannot be used here, otherwise an error will be reported
  const reg = /\?$/
  return reg.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

export const generateTimeList = (interval: number): string[] => {
  const format = (n: number) => {
    const h = Math.floor(n / 60)
    const m = n % 60
    return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`
  }

  let i = 0
  const arr: string[] = []
  while (i < 24 * 60) {
    arr.push(format(i))
    i += interval
  }

  return arr
}
