/**
 * 这种方式支持单个排序
 * @todo 支持多排序
 * this.sort[`$prop`] = "desc"
 */
export default {

  methods: {
    onSortChange ({ column, prop, order }) {
      if (prop != null) {
        this.query.sort = prop
        if (order === 'descending') {
          this.query.order = 'desc'
        } else {
          this.query.order = 'asc'
        }
        this.load()
      }
    }
  }
}
