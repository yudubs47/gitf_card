import { get, post, ReqParams } from './request'

export const getWechat = () => get({ url:'/api/v1/auth/wechat' })
export const updateWechat = (params: ReqParams) => get({ url:'/api/v1/auth/save/wechat', ...params })
export const getAlipay = () => get({ url:'/api/v1/auth/alipay' })
export const updateAlipay = (params: ReqParams) => get({ url:'/api/v1/auth/save/alipay', ...params })

export const getBankCardList = () => get({ url:'/api/v1/auth/bankCardList' })
export const getBankList = () => get({ url:'/api/v1/auth/bankList' })

export const addBankCardPersonalPost = (params: ReqParams) => get({ url:'/api/v1/auth/addBankCardPersonal', ...params })

export const getBalance = () => get({ url:'/api/v1/withdraw/balance' })

export const withdrawCardPost = (params: ReqParams) => get({ url:'/api/v1/withdraw/add/withdraw/card', ...params })
export const withdrawWechatPost = (params: ReqParams) => get({ url:'/api/v1/withdraw/add/withdraw/wecchat', ...params })
export const withdrawAlipayPost = (params: ReqParams) => get({ url:'/api/v1/withdraw/add/withdraw/alipay', ...params })

export const withdrawPagePost = (params: ReqParams) => post({ url:'/api/v1/withdraw/page/withdraw', ...params })
