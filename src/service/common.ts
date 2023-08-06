import { get, post, ReqParams } from './request'

// export const getImageCode = () => get({ url:'/api/v1/auth/imageCode' })

export const registerPost = (params: ReqParams) => post({ url:'/api/v1/auth/register', ...params })
export const sendSmsPost = (params: ReqParams) => post({ url:'/api/v1/auth/sendSms', ...params })
export const loginPassPost = (params: ReqParams) => post({ url:'/api/v1/auth/loginPass', ...params })
export const loginVerifyCodePost = (params: ReqParams) => post({ url:'/api/v1/auth/loginVerifyCode', ...params })

export const updatePasswordPost = (params: ReqParams) => post({ url:'/api/v1/auth/updatePassword', ...params })

export const logoutPost = (params?: ReqParams) => post({ url:'/api/v1/auth/logout', ...(params || {}) })

export const updatePhonePost = (params: ReqParams) => post({ url:'/api/v1/auth/updatePhone', ...params })

// 所有卡种
export const getAllCard = () => get({ url:'/api/v1/platform/allCard' })