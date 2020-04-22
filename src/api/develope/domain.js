import axios from '@/plugin/axios'
const prefix = ''

// let domain = '/sheet/sheet?editFileId=';

// export const onlineXls = axios.defaults.baseURL +`${domain}`;
// export const onlineXls = 'http://localhost:8090/report/sheet?editFileId=';

// 列表
export const listbase = params => {
  return axios.post(`${prefix}base/list`, params)
}
// 保存
export const savebase = params => {
  return axios.post(`${prefix}base/save`, params)
}

// 保存
export const savebasemx = params => {
  return axios.post(`${prefix}base/savemx`, params)
}

// 更新
export const updatebase = params => {
  return axios.put(`${prefix}base/update`, params)
}

// 删除
export const deletebase = params => {
  return axios.post(`${prefix}base/delete/${params.id}`)
}
export const deletebasemx = id => {
  return axios.post(`${prefix}base/deletemx/${id}`)
}

// 批量删除
export const deleteAllbase = params => {
  return axios.delete(`${prefix}base/deleteAll`, { params: params })
}

// 初始化
export const baseinit = () => {
  return axios.get(`${prefix}base/init`)
}

// vue 模板数据
export const basevue = (id, type = '01', params) => {
  return axios.post(`${prefix}base/vue/${id}/${type}`, params)
}
