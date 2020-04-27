/**
 * 设置表格高度
 */
export default {
  data () {
    return {
      tableHeight: 100, // 默认高度
      windowHeight: 100 // 默认高度

    }
  },

  mounted () {
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },

  methods: {
    setHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      let footerHeight = 0
      if (this.$refs['footer']) {
        footerHeight = this.$refs['footer'].parentNode.offsetHeight
      }
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      this.tableHeight = dynamicHeight
      this.windowHeight = window.innerHeight
    }

  }
}
