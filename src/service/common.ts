import { get, post } from './request'

export const getImageCode = () => post('/api/v1/auth/imageCode')