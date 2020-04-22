/**
 * 设置表格高度
 */
export default {
  data () {
    return {
      tableHeight: 100 // 默认高度
    }
  },
  mounted () {
    window.removeEventListener('resize', this.setHeight)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    setHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.parentNode.offsetHeight
      let footerHeight = 0
      if (this.$refs['footer']) {
        footerHeight = this.$refs['footer'].parentNode.parentNode.offsetHeight
      }
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      this.tableHeight = dynamicHeight
    }

  }
}
