import { get, post, ReqParams } from './request'

// 所有卡种
export const getAccountView = () => get({ url:'/api/v1/account/accountView' })

export const realFacerPost = (params: ReqParams) => post({ url:'/api/v1/auth/realFacer', ...params })
