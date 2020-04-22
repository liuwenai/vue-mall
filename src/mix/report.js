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
    initReport: function () {
      const savedQuery = this.savequery[this.query.name] || {}
      if (!isEmpty(savedQuery)) {
        this.query = savedQuery
      }
    },
    saveReport: function () {
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
