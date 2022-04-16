/**
 * Data processing class
 */
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestOptions, RequestResult } from '@suiji/types'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions,
  ) => AxiosRequestConfig

  /**
   * @description: Request successfully processed
   */
  transformRequestHook?: (
    res: AxiosResponse<RequestResult>,
    options: RequestOptions,
  ) => any

  /**
   * @description: Request failed handling
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  /**
   * @description: Interceptor before request
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => AxiosRequestConfig

  /**
   * @description: Interceptor after request
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * @description: Interceptor error handling before request
   */
  requestInterceptorsCatch?: (error: Error) => void

  /**
   * @description: Interceptor error handling after the request
   */
  responseInterceptorsCatch?: (error: Error) => void
}
