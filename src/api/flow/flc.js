import axios from '@/plugin/axios'
const prefix = ''

export const flcsave = params => {
  return axios.post(`${prefix}flc/save`, params)
}

export const flcupdate = params => {
  return axios.put(`${prefix}flc/update`, params)
}

export const flcupdateLcjb = params => {
  return axios.post(`${prefix}flc/updateLcjb`, params)
}

export const flcdelete = params => {
  return axios.post(`${prefix}flc/delete/${params.id}`)
}

export const flcshow = params => {
  return axios.get(`${prefix}flc/show/${params.id}`)
}

// 罗列基础表
export const flclistBase = id => {
  return axios.get(`${prefix}flc/listBase/${id}`)
}

export const flclist = params => {
  return axios.post(`${prefix}flc/list`, params)
}
