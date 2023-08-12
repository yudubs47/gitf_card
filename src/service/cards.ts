import { get, post, ReqParams } from './request'

export const historyPost = (params: ReqParams) => post({ url:'/api/v1/card/history', ...params })
export const historyBatchPost = (params: ReqParams) => post({ url:'/api/v1/card/historyBatch', ...params })
export const carmishPost = (params: ReqParams) => post({ url:'/api/v1/card/add/carmis', ...params })
export const batchcarmisPost = (params: ReqParams) => post({ url:'/api/v1/card/add/batchcarmis', ...params })

export const getViewCard = (params?: ReqParams) => get({ url:'/api/v1/card/view', ...params })