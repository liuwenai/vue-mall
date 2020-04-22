/**
 * 数据检查处理
 */
import isEmpty from 'lodash/isEmpty'
export default {
  data () {
    return {
      selrow: {},
      selmxrow: {}
    }
  },
  computed: {
    canOperate () {
      // 表头操作
      return isEmpty(this.selrow)
    },
    canOperateMx () {
      // 明细表格操作
      return isEmpty(this.selmxrow)
    },
    canEditable () {
      return this.title === '编辑'
    },
    canSh () {
      return this.selrow && this.selrow.fdjzt === '1'
    },
    canQxSh () {
      return this.selrow && this.selrow.fdjzt === '0'
    }
  },
  methods: {
    doCheck (lx = 'bt') {
      let seldata = {}
      if (lx === 'bt') {
        seldata = this.selrow
      } else if (lx === 'mx') {
        seldata = this.selmxrow
      }
      if (isEmpty(seldata)) {
        this.$notify({
          type: 'warning',
          message: '请先选中一条数据！'
        })
        return false
      } else {
        return true
      }
    },
    // 流程审核检查
    doFlowCheck (djzt = '0') {
      if (this.doCheck()) {

      }
    },
    doCheckSh () {
      if (this.selrow.fdjzt === '1') {
        this.$notify({
          type: 'warning',
          message: '已审核，不可操作！'
        })
        return false
      } else {
        return true
      }
    },
    activeMethod ({ row, column }) {
      return !this.canSh
      // return this.checkEditStatus(row, column).status;
    },
    checkEditStatus (row, column) {
      debugger
      const status = !this.canSh
      const message = status ? '' : '单据已经审核，不能修改'
      return { status, message }
    }
  }
}
