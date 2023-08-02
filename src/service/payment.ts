import { get, post, ReqParams } from './request'

export const getWechat = () => get({ url:'/api/v1/auth/wechat' })

