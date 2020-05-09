import axios from '@/plugin/axios'
const prefix = ''

export const itemorderlist = () => {
  return axios.get(`${prefix}itemorder/index`)
}

export const itemorderupdate = (params) => {
  return axios.post(`${prefix}itemorder/update`, params)
}

export const itemorderdelete = (params) => {
  return axios.post(`${prefix}itemorder/delete/${params.id}`)
}

export const itemordersave = (params) => {
  return axios.post(`${prefix}itemorder/save`, params)
}
