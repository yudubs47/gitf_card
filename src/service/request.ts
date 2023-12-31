import axios from 'axios'
import { message, Modal } from 'antd'
const counter = window.counter as any

const request = axios.create({
  baseURL: 'http://185.106.177.48:9101/',
})
request.interceptors.response.use(function (response) {
  console.log('---resp data---', response.data)
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export type ReqParams = {
  params?: { [key: string]: any };
  urlParams?: (string | number)[];
  config?: { [key: string]: any }
}

export type GetParams = {
  url: string;
} & ReqParams

type Resp = {
  code: string | number;
  message: string;
  data: any;
}

export const get = (getParams: GetParams) => {
  request.defaults.headers.common['tahm_kench'] = window.localStorage.getItem('token')
  const {url, params, urlParams} = getParams
  const reqUrl = urlParams ? `${url}/${urlParams.join('/')}` : url
  const reqFn = request.get<any, Resp>(reqUrl, params)
    .then(function (response) {
      if(response.code == 0) {
        // message.success(response.message)
        return response.data
      } else {
        if(response.code == -2) {
          counter.add()
          if(counter.count === 0) {
            Modal.info({
              title: '提示',
              content: '用户未登录',
              onOk: () => {
                window.location.href = '/#/login'
                counter.subtraction()
              },
              onCancel: () => {
                window.location.href = '/#/login'
                counter.subtraction()
              }
            })
          }
        } else {
          message.error(response.message)
        }
        throw new Error(response.message)
      }
    })
  reqFn.catch(function (error) {
    console.log('error', error);
  })
  return reqFn
}

export const post = (getParams: GetParams) => {
  request.defaults.headers.common['tahm_kench'] = window.localStorage.getItem('token')
  const {url, params, urlParams, config={}} = getParams
  const reqUrl = urlParams ? `${url}/${urlParams.join('/')}` : url
  const reqFn = request.post<any, Resp>(reqUrl, params, config)
    .then(function (response) {
      if(response.code == 0) {
        // message.success(response.message)
        return response.data
      } else {
        if(response.code == -2) {
          counter.add()
          if(counter.count === 0) {
            Modal.info({
              title: '提示',
              content: '用户未登录',
              onOk: () => {
                window.location.href = '/#/login'
                counter.subtraction()
              },
              onCancel: () => {
                window.location.href = '/#/login'
                counter.subtraction()
              }
            })
          }
        } else {
          message.error(response.message)
        }
        throw new Error(response.message)
      }
    })
  reqFn.catch(function (error) {
    console.log('error', error);
  })
  return reqFn
}