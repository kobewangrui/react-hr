import axios from 'axios'
// import loading from '../utils/loading'
// import {message} from 'antd'

const axiosRequest = axios.create()

// const getUrl = (url, mock) => {
//   return mock ? `/${url}` : `/api/${url}`
// }

// let reqQueue = 0

// axiosRequest.interceptors.request.use(config => {
//   if (config['loading']) {
//     reqQueue += 1
//     loading.show()
//   }
//   config.url = getUrl(config.url, config['mock'])
//   config.headers['Authorization'] = ''
//   return config
// }, error => {
//   if (error.config['loading']) {
//     reqQueue -= 1
//     reqQueue === 0 && loading.hide()
//   }
//   return Promise.reject(error)
// })

// axiosRequest.interceptors.response.use(response => {
//   if (response.config['loading']) {
//     reqQueue -= 1
//     reqQueue === 0 && loading.hide()
//   }
//   if (response.data.code !== 0) {
//     message.error(response.data.message)
//     return Promise.reject(response.data)
//   }
//   return response.data.data
// }, error => {
//   if (error.config['loading']) {
//     reqQueue -= 1
//     reqQueue === 0 && loading.hide()
//   }
//   return Promise.reject(error.message)
// })

export default {
  get(url, data){
    return axiosRequest({
      url,
      method: 'GET',
      loading: true,
      params: data
    })
  },
  post(url, data) {
    return axiosRequest({
      url,
      method: 'POST',
      loading: true,
      data
    })
  },
  put(url, data) {
    return axiosRequest({
      url,
      method: 'put',
      loading: true,
      params: data
    })
  },
  delete(url, data) {
    return axiosRequest({
      url,
      method: 'delete',
      loading: true,
      params: data
    })
  },
}
