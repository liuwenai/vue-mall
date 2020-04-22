<!-- general tree help dictionary -->
<template>
    <el-dialog
            v-dialogDrag
            :title="title"
            :visible.sync="dialogVisible"
            :show="dialogVisible"
            @close="doClose"
            :width="width"
    >
        <div class="grid-header">
            <el-input
                    class="help-input"
                    v-model="query.val"
                    placeholder="模糊查找"
                    :clearable="true"
                    @clear="load"
                    @keyup.enter.native="load"
            ></el-input>
            <el-button type="primary" size="mini" @click="load" slot="append"
            >查询</el-button
            >
            <el-button type="primary" size="mini" @click="doOk">确定</el-button>
        </div>
        <el-table
                :height="height"
                ref="helptable"
                :data="rows"
                v-loading="showLoading"
                highlight-current-row
                border
                @select-all="doCheckAll"
                @select="doCheck"
                @row-click="doRowClick"
                @row-dblclick="doRowDblClick"
                @current-change="doSelect"
                @selection-change="doSelsChange"
                @sort-change="onSortChange"
        >
            <el-table-column
                    type="selection"
                    v-if="seltype === 'M'"
                    align="center"
                    fixed="left"
            ></el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
            ></el-table-column>
            <template v-for="col in table.cols">
                <template v-if="col.formatter">
                    <el-table-column
                            :key="col.prop"
                            :min-width="col.width"
                            :prop="col.prop"
                            :label="col.label"
                            :formatter="getFormatter(col.formatter)"
                            :align="col.type === 'number' ? 'right' : 'left'"
                            header-align="center"
                            :sortable="getSort(col)"
                    />
                </template>
                <template v-else>
                    <el-table-column
                            :key="col.prop"
                            :min-width="col.width"
                            :prop="col.prop"
                            :label="col.label"
                            :align="col.type === 'number' ? 'right' : 'left'"
                            header-align="center"
                            show-overflow-tooltip
                            sortable="custom"
                    />
                </template>
            </template>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-row>
                <el-pagination
                        @size-change="handlePage"
                        @current-change="handleCurPage"
                        :page-sizes="[20, 50, 100]"
                        :page-size="max"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        style="float:left;"
                ></el-pagination>
            </el-row>
        </div>
    </el-dialog>
</template>

<script>
import { Helptable } from './helptable'
import { allApi } from '../../api'
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import _ from 'lodash'

export default {
  mixins: [serversort, types],
  name: 'HelpTableDic',
  props: {
    title: {
      type: String,
      default: '帮助字典'
    },
    dicname: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '400'
    },
    width: {
      type: String,
      default: '70%'
    },
    seltype: {
      type: String,
      default: 'S'
    },
    max: {
      type: Number,
      default: 20
    },
    offset: {
      type: Number,
      default: 0
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    params: {
      // 传递参数
      type: Object,
      required: false
    },
    sortParams: {
      // 传递参数
      type: Object,
      default () {
        return { sort: '', order: '' }
      },
      required: false
    },
    // 初始化数据
    initrows: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      cols: [],
      tables: Helptable,
      table: {},
      query: {
        sort: this.sortParams.sort,
        order: this.sortParams.order,
        col: '',
        val: '',
        type: '%'
      },
      showLoading: false,
      rows: [],
      total: 0,
      selectRows: null,
      dialogVisible: this.dialogShow
    }
  },
  watch: {
    dialogShow (val) {
      this.dialogVisible = val
      if (val) {
        this.table = this.tables[this.dicname]
        if (this.initrows) {
          this.rows = this.initrows
        } else {
          this.load()
        }
      }
    },
    dicname (dic) {
      this.table = this.tables[dic]
    },
    initrows (nv, ov) {
      this.rows = nv
    },
    'query.val' (nv, ov) {
      _.debounce(this.load(), 300)
    }
  },
  methods: {
    getFormatter (name) {
      return this[name]
    },
    getSort (col) {
      return _.get(col, 'sort', '')
    },
    doCheckAll (selection) {
      this.selectRows = selection
    },
    doCheck (selection, row) {
      this.selectRows = selection
    },
    doClose () {
      // let selectedRow = this.selectRows.slice(0);
      // this.selectRows = null;
      this.rows = []
      this.total = 0
      this.$refs.helptable.clearSelection()
      this.$emit('close')
    },
    doOk () {
      // let selectedRow = this.selectRows.slice(0);
      // this.selectRows = null;
      this.rows = []
      this.total = 0
      this.$refs.helptable.clearSelection()
      this.$emit('helpdata', this.selectRows, false)
      // this.$emit('gropudata', this.selectRows, false)
    },
    load () {
      // let criteria = {"fbh":{"$in":"select fxmbh from Bizsjfpbmx"}};
      // 根据传递的参数，来决定是否走模糊查询还是精确查询
      const child = _.has(this.params, 'child') ? { child: false } : {}
      let pparams = _.omit(this.params, 'child')
      Object.keys(pparams).forEach(key => {
        if (pparams[key] === null || pparams[key] === undefined) {
          pparams[key] = ''
        }
      })
      let searchtype = '$or'
      if (_.has(pparams, 'type')) {
        searchtype = pparams.type
        pparams = _.assign({}, _.omit(pparams, 'type'))
      }
      // eslint-disable-next-line one-var
      let criteria = { ...pparams }
      let serversort = {}
      let params = {}

      if (
        _.get(this.query, 'sort', '') !== '' &&
                    _.get(this.query, 'order', '') !== ''
      ) {
        serversort[this.query.sort] = this.query.order
      }
      // 根据配置列模糊查询
      if (!_.isEmpty(this.query.val)) {
        this.table.cols.forEach(col => {
          if (_.get(col, 'search', true)) {
            if (_.has(col, 'type') && col.type === 'number') {
              if (_.isNumber(this.query.val)) {
                criteria[col.prop] = { $gt: this.query.val }
              }
            } else {
              criteria[col.prop] = '%' + this.query.val + '%'
            }
          }
        })
      }
      let cc = {}
      if (searchtype === '$or') {
        cc['$or'] = criteria
      } else {
        cc = criteria
      }

      params = _.assign(
        {},
        child,
        {
          max: this.max,
          offset: this.offset
        },
        { sort: serversort },
        { criteria: cc }
      )

      // debugger;
      this.showLoading = true
      allApi[this.table.action](params)
        .then(response => {
          if (response.code === -100) {
            this.$message.error(response.msg)
            this.showLoading = false
            return
          }
          const mydata = response.rows
          // mydata.forEach(item => {
          //   if (item.fxsf) {
          //     item.fxsf = '是'
          //   } else {
          //     item.fxsf = '否'
          //   }
          // })
          this.rows = mydata
          // this.rows = response.rows;
          this.total = response.total
          this.max = response.max
          this.showLoading = false
        })
        .finally(() => {
          this.showLoading = false
        })
    },
    doSelect (currentRow, oldCurrentRow) {
      this.selectRows = currentRow
    },
    doRowClick (row, column, event) {
      // let isShow = this.seltype !== 'S'
      // this.$emit("helpdata", row, isShow);
    },
    doRowDblClick (row, column, event) {
      // let isShow = this.seltype !== 'S'
      this.selectRows = row
      this.doOk()
    },
    doSelsChange () {},
    handlePage (val) {
      this.max = val
      this.offset = this.max * this.currentPage
      this.load()
    },
    handleCurPage (val) {
      this.currentPage = val - 1
      if (this.currentPage <= -1) {
        this.currentPage = 0
      }
      this.offset = this.max * this.currentPage
      this.load()
    },
    // 打开查询窗口的
    onOpenQueryDialog () {
      this.dialogVisible = true
      // this.dialogVisible = true
    }
  },
  mounted () {}
}
</script>

<style ref="stylesheet" lang="scss" scoped>
    // @import '../../scss/variables.scss';

    // .el-select .el-input {
    //   width: 120px;
    // }

    // .el-dialog__body{
    //   padding:5px 20px
    // }
    // .el-dialog__header{
    //     background: $--color-primary;

    // }
    .help-select {
        width: 120px;
    }

    .help-input {
        width: 400px;
    }
</style>
