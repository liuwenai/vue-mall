import axios from '@/plugin/axios'
const prefix = ''

/**
*
* 根据模型形成模板数据
* @param {*} params
* params 样列
* {
        "module":"file",
        "title":"微信联系人",
        "domain":"com.zysoft.vbot.macos.domain.WCContact",
        "type":"table"
    }
*/
export const modelvue = params => {
  return axios.post(`${prefix}template/vue`, params)
}
/**
 * 模型列表数据
 * @param {*} params
 */
export const modellist = params => {
  return axios.get(`${prefix}template/list`, {
    params
  })
}
