import axios from '@/plugin/axios'
const prefix = '/'

/**
 * 文件上传下载
 * @param {控制器} controller
 * @param {事件} action
 */
export const fileAction = (controller, action = 'upload') => {
  return axios.defaults.baseURL + `${prefix}${controller}/${action}`
}

// 下载,如果不行，可以先post 形成文件，然后再 get 下载文件
export const fileExport = (url, params) => {
  return axios({
    url: url,
    method: 'POST',
    data: params
    // ,responseType: 'blob'
  })
}
