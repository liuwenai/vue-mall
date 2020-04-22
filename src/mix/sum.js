import get from 'lodash/get'
import has from 'lodash/has'
import sumBy from 'lodash/sumBy'
import map from 'lodash/map'
import includes from 'lodash/includes'
import toNumber from 'lodash/toNumber'
import format from 'number-format.js'

export default {
  data () {
    return {
      sum: {},
      sumClient: {}
    }
  },
  methods: {
    // 服务端汇总
    getSum (param) {
      const { columns, data } = param
      const sums = []
      const summap = this.sum
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (has(summap, column.property)) {
          // sums[index] = get(summap,column.property)
          sums[index] = format('#,##0.00', get(summap, column.property))
        }
      })
      return sums
    },
    // 客户端数据汇总
    getSumClient (param) {
      const { columns, data } = param
      const sums = []
      const sumClient = this.sumClient
      const cols = map(columns, 'property')
      const isfjsj = includes(cols, 'fjs') // 是否分级数据
      cols.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (has(sumClient, column)) {
          // console.log(cols)
          // sums[index] = _.get(summap,column.property)
          if (isfjsj) {
            sums[index] = format(
              '#,##0.00',
              sumBy(data, item => {
                if (get(item, 'fmx') === 0) {
                  return 0
                } else {
                  return toNumber(item[column])
                }
              })
            )
          } else {
            //
            let sumje = 0
            map(data, (item) => {
              sumje += toNumber(item[column])
            })
            sums[index] = format('#,##0.00', sumje)
          }
        }
      })
      return sums
    }
  }
}
