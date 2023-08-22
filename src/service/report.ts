import { get, post, ReqParams } from './request'

export const reportPage = (params?: ReqParams) => post({ url:'/api/v1/report/page', ...params })
export const orderReportPage = (params?: ReqParams) => post({ url:'/api/v1/report/order/page', ...params })