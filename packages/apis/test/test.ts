import { request } from '@suiji/request'

enum Api {
  // The address does not exist
  Test = '/test',
}

/**
 * @description: Trigger ajax test
 */

export const testApi = () => {
  return request.get({ url: Api.Test })
}
