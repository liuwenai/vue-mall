import axios from '@/plugin/axios'
// const prefix = "/admin/";
const prefix = ''

export const userfindByUsername = params => {
  return axios.get(`${prefix}user/findByUsername`, { params })
}

export const useradmin = params => {
  return axios.get(`${prefix}user/admin`, { params })
}

export const usermyinfo = params => {
  return axios.get(`${prefix}user/myinfo`, { params })
}

export const userqueryCurrent = params => {
  return axios.get(`${prefix}user/queryCurrent`, { params })
}

export const userdeleteAll = params => {
  return axios.post(`${prefix}user/deleteAll`, params)
}
export const userlist = params => {
  return axios.post(`${prefix}user/list`, params)
}

// 用户拥有的角色
export const userrole = id => {
  return axios.get(`${prefix}user/role/${id}`)
}
// 角色对应的菜单
export const userrolemenu = id => {
  return axios.get(`${prefix}user/rolemenu/${id}`)
}
// 多个角色对应的菜单
export const userrolesmenu = params => {
  return axios.post(`${prefix}user/rolesmenu`, params)
}

/**
 * 所有角色列表
 */
export const userrolelist = params => {
  return axios.post(`${prefix}user/rolelist`, params)
}

export const usermenu = params => {
  return axios.get(`${prefix}user/menu`, { params })
}

export const usersave = params => {
  return axios.post(`${prefix}user/save`, params)
}

export const userrolessave = params => {
  return axios.post(`${prefix}user/saveroles`, params)
}

export const userupdate = params => {
  return axios.post(`${prefix}user/update`, params)
}

export const userLogin = params => {
  return axios.post(`${prefix}login`, params)
}
export const userdelete = params => {
  return axios.post(`${prefix}user/delete/${params.id}`)
}

export const userchangepwd = params => {
  return axios.post(`${prefix}user/changePwd`, params)
}

export const usertree = () => {
  return axios.get(`${prefix}user/tree`)
}

export const userdataall = () => {
  return axios.get(`${prefix}user/dataall`)
}
/**
 * 保存用户对应的数据权限
 * @param {*} params
 * params 格式 {users:选中的用户id,type:对应左边选择的,ids:[选择的数据列表]}
 */
export const userdatasave = params => {
  return axios.post(`${prefix}user/savePermission`, params)
}

//
/**
 * 显示用户对应的数据权限
 * @param {*} params
 * params 格式 {id:选中的用户id,type:对应左边选择的}
 */
export const userdatalist = params => {
  return axios.post(`${prefix}user/permission`, params)
}

export const userupload = axios.defaults.baseURL + `${prefix}user/upload`
