import axios from '@/plugin/axios'
const prefix = ''

export const xsheetsave = params => {
  return axios.post(`${prefix}xsheet/save`, params)
}

export const xsheetupdate = params => {
  return axios.put(`${prefix}xsheet/update`, params)
}

export const xsheetdelete = id => {
  return axios.post(`${prefix}xsheet/delete/${id}`)
}

export const xsheetshow = id => {
  return axios.get(`${prefix}xsheet/show/${id}`)
}

export const xsheetlist = params => {
  return axios.post(`${prefix}xsheet/list`, params)
}
