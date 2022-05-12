import { request } from '@suiji/request'

const Api = {
  Signup: '/user/signup',
  Signin: '/user/signin',
  RequestResetPassword: '/user/sign/requestResetPassword',
  ResetPassword: '/user/sign/resetPassword',
} as const

export interface CommonParams {
  username: string
  password: string
}

export interface SigninResp {
  username: string
  email: string
  token: string
}

export interface ResetPasswordParams extends CommonParams{
  code: string
}

export const SignupApi = (data: CommonParams) => {
  return request.post({ url: Api.Signup, data })
}

export const SigninApi = (data: CommonParams) => {
  return request.post({ url: Api.Signin, data })
}

export const RequestResetPasswordApi = (data: { username: string }) => {
  return request.post({ url: Api.RequestResetPassword, data })
}

export const ResetPasswordApi = (data: ResetPasswordParams) => {
  return request.post({ url: Api.ResetPassword, data })
}
