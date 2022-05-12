import { initRequest } from '@suiji/request'
import { useI18n } from '@suiji/locale'
import { getGlobalConfig } from '@/internal'
import { useMessage } from '@/hooks/web/useMessage'

const initService = async() => {
  const { apiUrl, urlPrefix, uploadUrl } = getGlobalConfig()
  const { createMessage, createErrorModal } = useMessage()
  const { t } = useI18n()

  await initRequest({
    apiUrl,
    urlPrefix,
    uploadUrl,
    getTokenFunction: () => {
      return localStorage.getItem('token')
    },
    unauthorizedFunction: () => {},
    errorFunction: createMessage.error,
    errorModalFunction: createErrorModal,
    errorLogFunction: () => {},
    handleErrorFunction: (message, mode) => {
      if (mode === 'modal')
        createErrorModal({ title: t('sys.api.errorTip'), content: message })

      else if (mode === 'message')
        createMessage.error(message)
    },
    timeoutFunction: () => {},
  })
}

export const initModules = async() => {
  await Promise.all([initService()])
}
