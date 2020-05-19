import axios from '@/plugin/axios'
const prefix = ''

export const booklist = () => {
  return axios.get(`${prefix}book/index`)
}

export const bookupdate = (params) => {
  return axios.post(`${prefix}book/update`, params)
}

export const bookdelete = (params) => {
  return axios.post(`${prefix}book/delete/${params.id}`)
}

export const booksave = (params) => {
  return axios.post(`${prefix}book/save`, params)
}

// export const bookUpload = () => {
//   return axios.post(`${prefix}upload`)
// }

export const bookUpload = (controller, action = 'upload') => {
  return 'http://localhost:9090/' + `${prefix}${controller}/${action}`
}
