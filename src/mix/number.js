import format from 'number-format.js'
export default {

  methods: {
    numberFormatter (row, column, cellValue) {
      return format('#,##0.00', cellValue)
    },
    // 百分比格式
    numberFormatterPercent (row, column, cellValue) {
      return format('#,##0.00%', cellValue * 100)
    }
  }
}
