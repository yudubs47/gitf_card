import { get, post, ReqParams } from './request'
// 平台公告
export const platformNoticePost = () => post({ url:'/api/v1/platform/notice/page', params: { pageNo: 1, pageSize: 10 } })


// 行业咨询
export const platformInfoPost = () => post({ url:'/api/v1/platform/info/page', params: { pageNo: 1, pageSize: 10 } })
// 行业咨询详情
export const getInfoDetail = (params: ReqParams) => get({ url:'/api/v1/platform/info/detail', ...params })


// 提交意见反馈
export const platformAddTickPost = (params: ReqParams) => post({ url:'/api/v1/platform/addTick', ...params })


// 转让协议
export const getTransferAgreement = () => get({ url:'/api/v1/platform/transferAgreement' })
// 免责声明
export const getStatement = () => get({ url:'/api/v1/platform/statement' })
// 企业回收
export const getRecycle = () => get({ url:'/api/v1/platform/recycle' })
// 回收流程
export const getPullFlow = () => get({ url:'/api/v1/platform/pullFlow' })
// 常见问题
export const getFaq = () => get({ url:'/api/v1/platform/faq' })
// 兑换协议
export const getExchangeAgreement = () => get({ url:'/api/v1/platform/exchangeAgreement' })
// 商务合作
export const getCooperation = () => get({ url:'/api/v1/platform/cooperation' })
// 关于我们
export const getAbout = () => get({ url:'/api/v1/platform/about' })

// 联系我们
export const getContact = () => get({ url:'/api/v1/platform/contact' })