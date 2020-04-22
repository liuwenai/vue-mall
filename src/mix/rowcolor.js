/**
 * 行颜色处理
 */
import get from 'lodash/get'
export default {
  methods: {
    tableRowClassName (row, index) {
      let v = get(row, 'fstatus', '')
      if (v === '0') {
        return 'warning-row'
      } else if (v === '1') {
        return 'success-row'
      }
      return ''
    }
  }
}
