import { get, post, ReqParams } from './request'

// 所有卡种
export const getAccountView = () => get({ url:'/api/v1/account/accountView' })