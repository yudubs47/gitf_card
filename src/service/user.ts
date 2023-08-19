import { get, post, ReqParams } from './request'

// 所有卡种
export const getAccountView = () => get({ url:'/api/v1/account/accountView' })

export const realFacePost = (params: ReqParams) => post({ url:'/api/v1/auth/realFace', ...params })

export const inputRealPost = (params: ReqParams) => post({ url:'/api/v1/auth/inputReal', ...params })
