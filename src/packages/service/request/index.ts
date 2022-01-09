// Axios configuration
import type { AxiosResponse } from 'axios'
import type { RequestOptions, RequestResult } from '../../types'
import { context } from '../_bridge'
import {
  clone,
  deepMerge,
  isFunction,
  isString,
  setObjToUrlParams,
} from '../../utils'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '../../tokens'
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import { Axios } from './Axios'
import { checkStatus } from './checkStatus'
import { formatRequestDate, joinTimestamp } from './helper'

/**
 * @description: Data processing, convenient to distinguish multiple processing methods
 */
const transform: AxiosTransform = {
  /**
   * @description: Process request data. If the data is not in the expected format, you can throw an error directly
   */
  transformRequestHook: (
    res: AxiosResponse<RequestResult>,
    options: RequestOptions,
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // Whether to return native response headers For example: use this attribute when you need to get the response headers
    if (isReturnNativeResponse)
      return res

    const { t } = useI18n()

    // No processing, return directly
    // It is used when the page code may need to directly obtain the information such as code, data, and message.
    if (!isTransformResponse)
      return res.data

    // Return on error
    const { data } = res
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'))
    }

    // Here code, result, message are unified fields in the background
    const { code, result, message } = data

    const hasSuccess
      = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess)
      return result

    // Perform different operations on different codes
    // If you don’t want to interrupt the current request, please return the data, otherwise just throw an exception
    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage')
        context.timeoutFunction?.()
        break
      default:
        if (message)
          timeoutMsg = message
    }

    // When errorMessageMode=‘modal’, a modal error pop-up window will be displayed instead of a message prompt, which is used for some more important errors
    // errorMessageMode='none' Generally, when calling, it is clear that you do not want to automatically pop up an error message
    if (options.errorMessageMode === 'modal') {
      context.errorModalFunction({
        title: t('sys.api.errorTip'),
        content: timeoutMsg,
      })
    }
    else if (options.errorMessageMode === 'message') {
      context.errorFunction(timeoutMsg)
    }

    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'))
  },

  // Process config before request
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options

    if (joinPrefix) {
      config.url = `${isString(urlPrefix) ? urlPrefix : urlPrefix?.()}${
        config.url
      }`
    }

    if (apiUrl) {
      const _apuUrl = isString(apiUrl)
        ? apiUrl
        : isFunction(apiUrl)
          ? apiUrl?.()
          : ''
      config.url = `${_apuUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // Add a timestamp parameter to the get request to avoid getting data from the cache.
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false),
        )
      }
      else {
        // Compatible with restful style
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    }
    else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, 'data')
          && config.data
          && Object.keys(config.data).length > 0
        ) {
          config.data = data
          config.params = params
        }
        else {
          // If data is not provided for non-GET request, params will be treated as data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      }
      else {
        // Compatible with restful style
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: Request interceptor processing
   */
  requestInterceptors: (config, options) => {
    // Process config before request
    const token = context.getTokenFunction?.()
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization
        = options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token
    }
    return config
  },

  /**
   * @description: Response interceptor processing
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: Response error handling
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n()
    context.errorLogFunction?.(error)
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout'))
        errMessage = t('sys.api.apiTimeoutMessage')

      if (err?.includes('Network Error'))
        errMessage = t('sys.api.networkExceptionMsg')

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          context.errorModalFunction({
            title: t('sys.api.errorTip'),
            content: errMessage,
          })
        }
        else if (errorMessageMode === 'message') {
          context.errorFunction(errMessage)
        }
        return Promise.reject(error)
      }
    }
    catch (error) {
      throw new Error(error as unknown as string)
    }

    checkStatus(error?.response?.status, msg, errorMessageMode)
    return Promise.reject(error)
  },
}

const createAxios = (opt?: Partial<CreateAxiosOptions>) => {
  return new Axios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // Base interface address
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // If it is in form-data format
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // Data processing method
        transform: clone(transform),
        // Configuration items, the following options can be overridden in a separate interface request
        requestOptions: {
          // Add prefix to url by default
          joinPrefix: true,
          // Whether to return native response headers For example: use this attribute when you need to get the response headers
          isReturnNativeResponse: false,
          // Need to process the returned data
          isTransformResponse: true,
          // Add parameters to url when post request
          joinParamsToUrl: false,
          // Format submission parameter time
          formatDate: true,
          // Message prompt type
          errorMessageMode: 'message',
          // interface address
          apiUrl: () => context.apiUrl,
          // Interface splicing address
          urlPrefix: () => context.urlPrefix,
          // Whether to add a timestamp
          joinTime: true,
          // Ignore duplicate requests
          ignoreCancelToken: true,
          // Whether to carry token
          withToken: true,
        },
      },
      opt || {},
    ),
  )
}

export const defaultRequest = createAxios()

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
