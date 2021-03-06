import util from '@/libs/util.js'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state state
     */
    versionShow () {
      util.log.capsule('感谢使用书籍后台管理系统~', `v${process.env.VUE_APP_VERSION}`)
    }
  }
}
