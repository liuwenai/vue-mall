/**
 * 数据加载处理
 */
export default {
  data () {
    return {
      loadingtext: ''
    }
  },
  methods: {
    setLoading (text = '数据加载中...') {
      this.showLoading = true
      this.loadingtext = text
    }
  }
}
