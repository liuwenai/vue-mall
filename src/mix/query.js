/**
 * 组合查询  删除查询
 * @todo 继续完善优化
 */
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState('d2admin', {
      savequery: state => state.page.savequery
    })
  },

  methods: {
    // 组合查询
    groupQuery: function (index) {
      if (this.query.cols.length < index) {
        var obj = {
          col: [],
          val: '',
          type: '%'
        }
        this.query.cols.push(obj)
        this.$nextTick(() => {
          // this.setTableHeight()
          this.setHeight()
        })
      }
    },
    // 删除查询
    removeQuery: function (index) {
      var arr = []
      for (var i = 0; i < this.query.cols.length; i++) {
        if (i !== index) {
          arr.push(this.query.cols[i])
        }
      }
      this.query.cols = arr
      this.$nextTick(() => {
        this.setHeight()
      })
      this.load()
    },
    initQuery: function () {
      const savedQuery = this.savequery[this.query.name] || {}
      if (!isEmpty(savedQuery)) {
        this.query = savedQuery
      }
    },
    // 保存查询
    saveQuery: function () {
      const newquery = cloneDeep(this.savequery)
      newquery[this.query.name] = this.query
      this.$store.state.d2admin.page.savequery = newquery
      this.$store.dispatch('d2admin/db/set', {
        dbName: 'query',
        path: 'save',
        value: newquery,
        user: true
      })
    }
  }
}
