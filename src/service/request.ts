import axios from 'axios'
const commonUrl = 'http://185.106.177.48:9101'

export const get = (url: string, params?: { [key: string]: any }) => {
  return axios.get(`${commonUrl}${url}`, params)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
}

export const post = (url: string, params?: { [key: string]: any }) => {
  return axios.post(`${commonUrl}${url}`, params)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}