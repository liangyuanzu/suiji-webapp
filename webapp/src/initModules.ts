import { initRequest } from '@suiji/request'
import { getGlobalConfig } from '@/internal'

const initService = async() => {
  const { apiUrl, urlPrefix, uploadUrl } = getGlobalConfig()

  await initRequest({
    apiUrl,
    urlPrefix,
    uploadUrl,
    getTokenFunction: () => {},
    unauthorizedFunction: () => {},
    errorFunction: () => {},
    errorModalFunction: () => {},
    errorLogFunction: () => {},
    handleErrorFunction: () => {},
    timeoutFunction: () => {},
  })
}

export const initModules = async() => {
  await Promise.all([initService()])
}
