import axios from '@/plugin/axios'
// const prefix = '/admin/'
const prefix = ''

export const roleMenusave = params => {
  return axios.post(`${prefix}role/saveMenu`, params)
}

export const rolesave = params => {
  return axios.post(`${prefix}role/save`, params)
}

export const roleupdate = params => {
  return axios.put(`${prefix}role/update`, params)
}

export const roledelete = params => {
  return axios.post(`${prefix}role/delete/${params.id}`)
}

export const roledeleteAll = params => {
  return axios.post(`${prefix}role/deleteAll`, params)
}

export const roleshow = params => {
  return axios.get(`${prefix}role/show/${params.id}`)
}

export const rolelist = params => {
  return axios.post(`${prefix}role/list`, params)
}

export const rolemenu = params => {
  return axios.get(`${prefix}role/menu/${params.id}`)
}

export const rolemenus = params => {
  return axios.get(`${prefix}role/menus`, { params })
}
