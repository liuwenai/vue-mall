import axios from '@/plugin/axios'
const prefix = ''

export const addresslist = () => {
  return axios.get(`${prefix}address/index`)
}

export const addressupdate = (params) => {
  return axios.post(`${prefix}address/update`, params)
}

export const addressdelete = (params) => {
  return axios.post(`${prefix}address/delete/${params.id}`)
}

export const addresssave = (params) => {
  return axios.post(`${prefix}address/save`, params)
}
