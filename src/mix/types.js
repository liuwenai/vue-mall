import get from 'lodash/get'

const fxsfMap = { '0': '否', '1': '是', true: '是', false: '否' }
const fshowMap = { 'x': '行上', 'y': '列上' }
const booleanMap = { true: '是', false: '否' }

export default {
  data () {
    return {
      valueFormat: 'yyyyMMdd', // 后台保存日期格式
      showFormat: 'yyyy-MM-dd', // 前台显示日期格式
      fshowMap,
      fxsfMap,
      booleanMap
    }
  },

  methods: {
    formmatfxsf: function (row, col) {
      return get(fxsfMap, row[col.property], row[col.property])
    },

    booleanFormatter (row, col, val) {
      return get(booleanMap, row[col.property], row[col.property])
    },

    setLoading () {
      this.loadingtext = '数据加载中...'
      this.showLoading = true
    }
  }
}
