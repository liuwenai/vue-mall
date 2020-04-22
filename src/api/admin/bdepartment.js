import axios from '@/plugin/axios'
const prefix = ''

export const departmentsave = params => {
  return axios.post(`${prefix}department/save`, params)
}

export const departmentnext = params => {
  return axios.post(`${prefix}department/next`, params)
}

export const departmentupdate = params => {
  return axios.put(`${prefix}department/update`, params)
}

export const departmentdelete = params => {
  return axios.post(`${prefix}department/delete/${params.id}`)
}

export const departmentdeleteAll = params => {
  return axios.post(`${prefix}department/deleteAll`, params)
}

export const departmentshow = params => {
  return axios.get(`${prefix}department/show/${params.id}`)
}

export const departmentlist = params => {
  return axios.post(`${prefix}department/list`, params)
}

export const departmenttree = () => {
  return axios.get(`${prefix}department/tree`)
}

export const departmenchange = params => {
  return axios.post(`${prefix}department/change`, params)
}
