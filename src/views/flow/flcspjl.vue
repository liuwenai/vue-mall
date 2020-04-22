<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" :inline="true" :model="query" ref="header">
        <el-form-item label="单据状态">
          <el-select v-model="query.fdjzt" clearable style="width:120px">
            <el-option
              style="width:100%"
              v-for="(value,key) in fdjztMap"
              :key="key"
              :value="key"
              :label="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.val" placeholder="模糊查找" :clearable="true" @clear="load"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="load">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="operate('add')">新增</el-button>
          <el-button type="primary" size="mini" :disabled="canOperate" @click="onEdit">编辑</el-button>
          <el-button type="primary" size="mini" :disabled="canOperate" @click="onDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      :height="tableHeight"
      :data="rows"
      v-loading="showLoading"
      highlight-current-row
      stripe
      border
      @selection-change="selsChange"
      @row-click="onRowClick"
      @sort-change="onSortChange"
      show-summary
      :summary-method="getSumClient"
      @cell-dblclick="onDblClick"
    >
      <el-table-column type="selection" header-align="center" align="center"></el-table-column>
      <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
      <!-- <el-table-column
        min-width="100px"
        sortable="custom"
        prop="fywid"
        label="业务编号"
        show-overflow-tooltip
        align="center"
      ></el-table-column>-->
      <el-table-column
        min-width="100px"
        sortable="custom"
        prop="flc.fmc"
        show-overflow-tooltip
        label="流程"
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="100px"
        sortable="custom"
        prop="flcjb.fmc"
        label="流程级别"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="80px"
        sortable="custom"
        prop="fxh"
        label="顺序"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="100px"
        sortable="custom"
        prop="fdjzt"
        label="流程状态"
        :formatter="flcspjlfdjztformatter"
        show-overflow-tooltip
        align="center"
      ></el-table-column>

      <el-table-column
        min-width="140px"
        sortable="custom"
        prop="fspsj"
        show-overflow-tooltip
        label="审批时间"
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="120px"
        sortable="custom"
        prop="fspyj"
        show-overflow-tooltip
        label="审核意见"
        align="center"
      ></el-table-column>

      <!-- <el-table-column
        min-width="100px"
        sortable="custom"
        prop="fusername"
        label="用户编号"
        align="center"
        show-overflow-tooltip
      ></el-table-column>-->
      <el-table-column
        min-width="120px"
        sortable="custom"
        prop="fname"
        label="当前用户"
        show-overflow-tooltip
        align="center"
      >
        <template v-slot="scope">{{scope.row.fusername}}:{{scope.row.fname}}</template>
      </el-table-column>

      <!-- <el-table-column
        min-width="150px"
        sortable="custom"
        prop="fnextusername"
        label="下一节点用户编号"
        show-overflow-tooltip
        align="center"
      ></el-table-column> -->
      <el-table-column
        min-width="180px"
        sortable="custom"
        prop="fnextname"
        label="下一节点用户"
        align="center"
        show-overflow-tooltip
      >
        <template v-slot="scope">{{scope.row.fnextusername}}:{{scope.row.fnextname}}</template>
      </el-table-column>
      <el-table-column
        min-width="120px"
        sortable="custom"
        prop="fnextid"
        label="下一节编号"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        min-width="80px"
        sortable="custom"
        prop="fnote"
        label="备注"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="80px"
        sortable="custom"
        prop="fip"
        label="IP"
        show-overflow-tooltip
        align="center"
      ></el-table-column>-->
      <!-- <el-table-column
        min-width="135px"
        sortable="custom"
        prop="dateCreated"
        label="创建日期"
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="135px"
        sortable="custom"
        prop="lastUpdated"
        label="更新日期"
        align="center"
      ></el-table-column>-->

      <el-table-column
        label="操作"
        v-if="false"
        header-align="center"
        align="center"
        width="145"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" class="mediabtn" @click="operate('edit',scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            class="mediabtn"
            @click="handleDel('scope.$index',scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <div ref="footer">
        <el-button
          type="button"
          size="mini"
          @click="batchDel"
          :disabled="this.sels.length === 0"
        >批量删除</el-button>
        <el-pagination
          hide-on-single-page
          @size-change="handlePage"
          @current-change="handleCurPage"
          :page-sizes="[20,50,100]"
          :page-size="max"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="float:right;"
        ></el-pagination>
      </div>
    </template>
    <el-dialog
      v-dialogDrag
      :title="title"
      :top="'5%'"
      :visible.sync="form.visible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :model="form.fields" label-width="180px" :rules="form.rules" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fywid" label="业务编号" :error="form.errors.fywid">
              <el-input v-model.trim="form.fields.fywid" :disabled="false" placeholder="业务编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fdjzt" label="流程状态" :error="form.errors.fdjzt">
              <el-select v-model="form.fields.fdjzt" :disabled="true">
                <el-option
                  v-for="(value,key) in {'0':'单据提交','1':'未审核','2':'审核通过','9':'审核退回'}"
                  :key="key"
                  :value="key"
                  :label="value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fspyj" label="审核意见" :error="form.errors.fspyj">
              <el-input v-model.trim="form.fields.fspyj" :disabled="true" placeholder="审核意见"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fspsj" label="审核时间" :error="form.errors.fspsj">
              <el-input v-model.trim="form.fields.fspsj" :disabled="true" placeholder="审核时间"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fusername" label="用户编号" :error="form.errors.fusername">
              <el-input v-model.trim="form.fields.fusername" :disabled="false" placeholder="用户编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fname" label="用户姓名" :error="form.errors.fname">
              <el-input v-model.trim="form.fields.fname" :disabled="false" placeholder="用户姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fxh" label="序号" :error="form.errors.fxh">
              <el-input v-model.number="form.fields.fxh" :disabled="false" placeholder="序号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fnextid" label="下一节编号" :error="form.errors.fnextid">
              <el-input v-model.trim="form.fields.fnextid" :disabled="false" placeholder="下一节编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fnextusername" label="下一节点用户编号" :error="form.errors.fnextusername">
              <el-input
                v-model.trim="form.fields.fnextusername"
                :disabled="false"
                placeholder="下一节点用户编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fnextname" label="下一节点用户名称" :error="form.errors.fnextname">
              <el-input
                v-model.trim="form.fields.fnextname"
                :disabled="false"
                placeholder="下一节点用户名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fnote" label="备注" :error="form.errors.fnote">
              <el-input v-model.trim="form.fields.fnote" :disabled="false" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fip" label="IP" :error="form.errors.fip">
              <el-input v-model.trim="form.fields.fip" :disabled="true" placeholder="IP"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="dateCreated" label="创建日期" :error="form.errors.dateCreated">
              <el-input v-model.trim="form.fields.dateCreated" :disabled="true" placeholder="创建日期"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="lastUpdated" label="更新日期" :error="form.errors.lastUpdated">
              <el-input v-model.trim="form.fields.lastUpdated" :disabled="true" placeholder="更新日期"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleSubmit"
          :loading="form.loading"
        >提交</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="流程信息"
      :visible.sync="drawer"
      :direction="direction"
      @close="closeDialog('formlc')"
      size="50%"
    >
      <v-drawer :nodes="nodes" />
    </el-drawer>
    <help-table-dic
      :params="flcparams"
      title="流程"
      height="400"
      seltype="M"
      dicname="flc"
      :dialog-show="flcvisible"
      @helpdata="selectflc"
      @close="onCloseDialog"
    ></help-table-dic>
    <help-table-dic
      :params="flcjbparams"
      title="流程级别"
      height="400"
      seltype="M"
      dicname="flcjb"
      :dialog-show="flcjbvisible"
      @helpdata="selectflcjb"
      @close="onCloseDialog"
    ></help-table-dic>
  </d2-container>
</template>

<script>
// import vDrawer from '../../views/file/drawerlc'
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import query from '../../mix/query'
import importer from '../../mix/importer'
import sum from '../../mix/sum'
import flow from '../../mix/flow'

import check from '../../mix/check'
import _ from 'lodash'
import {
  flcspjllist,
  flcspjldelete,
  flcspjlupdate,
  flcspjlsave
} from '../../api/flow/flcspjl.js'

// form 默认数值
const initValues = {
  fywid: '',
  flc: { id: '', fmc: '' },
  flcjb: { id: '', fmc: '' },
  fdjzt: '',
  fspyj: '',
  fspsj: '',
  fusername: '',
  fname: '',
  fxh: '',
  fnextid: '',
  fnextusername: '',
  fnextname: '',
  fnote: '',
  fip: '',
  dateCreated: '',
  lastUpdated: ''
}
const initMxValues = {}
export default {
  name: 'flcspjl',
  mixins: [serversort, types, table, query, importer, check, sum, flow],
  // components: { vDrawer },
  data () {
    return {
      drawer: false,
      direction: 'rtl',
      title: '',
      showLoading: false,
      query: {
        name: 'flcspjl',
        val: '',
        sort: 'dateCreated',
        order: 'asc',
        fdjzt: ''
      },
      flcparams: {},
      flcvisible: false,
      flcjbparams: {},
      flcjbvisible: false,

      sels: [], // 列表选中列
      rows: [],
      total: 0,
      max: 20,
      offset: 0,
      currentPage: 0,
      form: {
        url: flcspjlsave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          fywid: [
            { required: true, message: '业务编号不能为空', trigger: 'blur' },
            { type: 'string', message: '业务编号必须为字符串', trigger: 'blur' }
          ],
          'flc.fmc': [
            { required: true, message: '流程不能为空', trigger: 'blur' }
          ],
          'flcjb.fmc': [
            { required: true, message: '流程级别不能为空', trigger: 'blur' }
          ],
          fusername: [
            { required: true, message: '用户编号不能为空', trigger: 'blur' },
            { type: 'string', message: '用户编号必须为字符串', trigger: 'blur' }
          ],
          fname: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' },
            { type: 'string', message: '用户姓名必须为字符串', trigger: 'blur' }
          ],
          fxh: [
            { required: true, message: '序号不能为空', trigger: 'blur' },
            { type: 'number', message: '序号必须为数字', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: _.assign({}, initValues)
      },
      formmx: {
        rules: {},
        errors: {},
        fields: _.assign({}, initMxValues)
      }
    }
  },
  // watch number 数据
  watch: {},
  mounted () {
    this.load()
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  methods: {
    load () {
      this.showLoading = true
      let criteria = {}
      const serversort = {}
      const { val } = this.query
      serversort[this.query.sort] = this.query.order

      const djcriteria = {}
      const fdjzt = this.query.fdjzt
      if (!_.isNil(fdjzt) && fdjzt !== '') {
        djcriteria['fdjzt'] = fdjzt
      }
      if (!_.isEmpty(val)) {
        ['col'].forEach(item => {
          criteria[item] = `%${val}%`
        })
      }
      let params = _.assign(
        {},
        { max: this.max, offset: this.offset },
        { sort: serversort },
        { criteria: { $and: { ...djcriteria, $or: criteria } } }
      )
      flcspjllist(params)
        .then(response => {
          if (response.code == -100) {
            this.$notify({
              title: '提示',
              message: response.msg,
              type: 'error'
            })
            this.showLoading = false
            return
          }
          this.rows = response.rows
          this.total = response.total
          this.max = response.max
          this.showLoading = false
        })
        .catch(error => {
          this.showLoading = false
        })
    },
    closeDialog () {
      //                this.$refs["addForm"].resetFields();
      //                this.selectBm = {};
    },
    // 多选调用方法
    selsChange: function (sels) {
      this.sels = sels
    },
    // 分页操作方法
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
    // 数据删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true
          let params = { id: row.id }
          flcspjldelete(params)
            .then(response => {
              if (response.code === -100) {
                this.$notify({
                  title: '提示',
                  message: response.msg,
                  type: 'error'
                })
                this.showLoading = false
                return
              }
              this.showLoading = false
              this.$notify({
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch(error => {
              this.showLoading = false
              this.$notify({
                title: '提示',
                message: error,
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            message: '取消操作',
            type: 'info'
          })
        })
    },
    // 批量删除
    batchDel: function () {
      let ids = this.sels.map(item => item.id)
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(
        () => {
          this.showLoading = true
          let params = { ids: ids }
          flcspjldeleteAll(params)
            .then(response => {
              if (response.code === -100) {
                this.$notify({})
                this.showLoading = false
                return
              }
              this.showLoading = false
              this.$notify({
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch(error => {
              this.showLoading = false
              this.$notify({
                title: '提示',
                message: error,
                type: 'error'
              })
            })
        },
        () => {
          this.$notify({
            title: '提示',
            message: '取消操作',
            type: 'info'
          })
        }
      )
    },
    operate: function (type, data) {
      this.form.visible = true
      if (type === 'edit') {
        this.title = '编辑'
        this.form.fields = _.assign({}, data)
        this.form.url = flcspjlupdate
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = flcspjlsave
      }
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, this.selrow)
        this.form.url = flcspjlupdate
      }
    },
    // 删除数据
    onDelete () {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    close: function () {
      this.form.visible = false
      this.form.loading = false
    },
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(
            () => {
              this.form.loading = true
              let params = _.assign({}, this.form.fields)
              this.form
                .url(params)
                .then(response => {
                  let message = response.msg || '提交成功'
                  if (response.code === -100) {
                    this.form.loading = false
                    this.$notify({
                      type: 'error',
                      message
                    })
                    let errors = _.get(response, 'errors', [])
                    errors.forEach(error => {
                      this.form.errors[error.field] = error.message
                    })
                    return
                  }
                  this.form.loading = false
                  this.$notify({
                    title: '提示',
                    message: message,
                    type: 'success'
                  })
                  this.form.visible = false
                  this.reset()
                  this.load()
                })
                .catch(error => {
                  this.form.loading = false
                  this.$notify({
                    title: '提示',
                    message: error,
                    type: 'error'
                  })
                })
            },
            () => {
              this.$notify({
                title: '提示',
                message: '取消操作',
                type: 'info'
              })
            }
          )
        }
      })
    },
    reset: function () {
      this.form.fields = _.assign({}, initValues)
    },
    onOpenDialog (type = 'dic') {
      this[`${type}visible`] = true
    },
    onCloseDialog (type = 'dic') {
      this[`${type}visible`] = false
    },
    onRowClick (row, col, event) {
      this.selrow = row
    },

    selectflc (row, show) {
      this.flcvisible = show
      if (row) {
        this.form.fields.flc = {
          id: row.id,
          fmc: row.fmc
        }
      }
    },
    selectflcjb (row, show) {
      this.flcjbvisible = show
      if (row) {
        this.form.fields.flcjb = {
          id: row.id,
          fmc: row.fmc
        }
      }
    },
    flcspjlfdjztformatter (row, col, val) {
      return _.get(
        { '0': '单据提交', '1': '未审核', '2': '审核通过', '9': '审核退回' },
        val,
        val
      )
    },
    onDblClick (row, column, cell, event) {
      if (column.property === 'fspname') {
        this.drawer = true
        this.showflow(row.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped >
@import "~@/assets/style/common.scss";
</style>
