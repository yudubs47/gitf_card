import { get, post, ReqParams } from './managerRequest'

export const loginPassPost = (params: ReqParams) => post({ url:'/api/v1/admin/auth/loginPass', ...params })

export const managerLogout = (params?: ReqParams) => get({ url:'/api/v1/admin/auth/logout', ...params })

export const withdrawPagePost = (params: ReqParams) => post({ url:'/api/v1/admin/withdraw/page/withdraw', ...params })
export const remitWithdraw = (params?: ReqParams) => get({ url:'/api/v1/admin/withdraw/remit', ...params })
export const auditWithdraw = (params?: ReqParams) => get({ url:'/api/v1/admin/withdraw/audit', ...params })

export const historyPost = (params: ReqParams) => post({ url:'/api/v1/admin/card/history', ...params })
export const historyBatchPost = (params: ReqParams) => post({ url:'/api/v1/admin/card/historyBatch', ...params })
export const auditHistory = (params?: ReqParams) => get({ url:'/api/v1/admin/card/audit', ...params })

export const reportPage = (params?: ReqParams) => post({ url:'/api/v1/admin/report/page', ...params })
export const orderReportPage = (params?: ReqParams) => post({ url:'/api/v1/admin/report/order/page', ...params })

export const auditCarmisHistory = (params?: ReqParams) => get({ url:'/api/v1/admin/card/auditCarmis', ...params })