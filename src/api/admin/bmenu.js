import axios from '@/plugin/axios'
// const prefix = "/admin/";
const prefix = ''

export const menuinit = params => {
  return axios.post(`${prefix}menu/init`, params)
}

export const menuinitAction = params => {
  return axios.post(`${prefix}menu/initAction`)
}

export const menusave = params => {
  return axios.post(`${prefix}menu/save`, params)
}

export const menuupdate = params => {
  return axios.put(`${prefix}menu/update`, params)
}

export const menudelete = params => {
  return axios.post(`${prefix}menu/delete/${params.id}`)
}
export const menudeleteAll = params => {
  return axios.post(`${prefix}menu/deleteAll`, params)
}

export const menushow = params => {
  return axios.get(`${prefix}menu/show/${params.id}`)
}

export const menulist = params => {
  return axios.post(`${prefix}menu/list`, params)
}
