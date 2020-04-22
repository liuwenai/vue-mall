import axios from '@/plugin/axios'
const prefix = ''

export const flcspjlsave = params => {
  return axios.post(`${prefix}flcspjl/save`, params)
}

export const flcspjlupdate = params => {
  return axios.put(`${prefix}flcspjl/update`, params)
}

export const flcspjldelete = params => {
  return axios.post(`${prefix}flcspjl/delete/${params.id}`)
}

export const flcspjlshow = params => {
  return axios.get(`${prefix}flcspjl/show/${params.id}`)
}

/**
 * 流程业务编号
 * @param {业务编号} id
 */
export const flcspjlflow = id => {
  return axios.get(`${prefix}flcspjl/flow/${id}`)
}

export const flcspjllist = params => {
  return axios.post(`${prefix}flcspjl/list`, params)
}
