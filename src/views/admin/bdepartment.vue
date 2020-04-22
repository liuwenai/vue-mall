<template>
  <d2-container ref="container">
    <split-pane
      :style="{ height: tableAutoHeightPX }"
      :min-percent="23"
      :default-percent="leftpanel.width"
      split="vertical"
    >
      <template slot="paneL">
        <div class="grid-content bg-purple">
          <div
            class="grid-header setHeight refreshTree"
            :style="{ height: tableAutoHeightPX }"
          >
            <div class="refresh">
              <i :class="classicon" @click="doExpand"></i>
              <i class="el-icon-refresh" @click="loadTree"></i>
              <i :class="leftpanel.icon" @click="doCollapse"></i>
            </div>
            <el-tree
              ref="tree"
              node-key="id"
              :data="treedata"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              @node-drag-end="handleDragEnd"
              :props="defaultProps"
              @node-click="onNodeClick"
            ></el-tree>
          </div>
          <div class="checkBoxTree">
            <el-checkbox @change="load" v-model="query.treemx"
              >包含所有下级</el-checkbox
            >
          </div>
        </div>
      </template>
      <template slot="paneR">
        <div class="grid-content bg-purple">
          <div class="grid-header">
            <el-form class="topHorizontal" :inline="true" ref="header">
              <el-form-item>
                <el-input
                  v-model="query.val"
                  placeholder="模糊查找"
                  :clearable="true"
                  @clear="load"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="load"
                  >查询</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="operate('addT', treeRow)"
                  >增加同级</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="operate('addX', treeRow)"
                  >增加下级</el-button
                >
                <el-button
                  type="primary"
                  :disabled="canOperate"
                  size="mini"
                  @click="onEdit"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  :disabled="canOperate"
                  size="mini"
                  @click="onDelete"
                  >删除</el-button
                >
                <el-button type="primary" size="mini" @click="download"
                  >导出</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-upload
                  :headers="header"
                  :show-file-list="false"
                  :on-progress="onProgress"
                  :action="fileAction('department', 'upload')"
                  :on-success="uploadSuccess"
                >
                  <el-button type="primary" size="mini" icon="upload"
                    >导入</el-button
                  >
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="grid-main">
            <el-table
              :height="tableAutoHeight"
              :data="rows"
              v-loading="showLoading"
              highlight-current-row
              border
              @selection-change="selsChange"
              @sort-change="onSortChange"
              @row-click="onRowClick"
              @row-dblclick="onRowDblClick"
            >
              <el-table-column
                type="selection"
                align="center"
                header-align="center"
              ></el-table-column>
              <el-table-column
                type="index"
                label="行号"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                sortable="custom"
                prop="id"
                label="编号"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              >
                <template slot="header">
                  <i class="el-icon-top-left" @click.stop="onBack">&nbsp;</i>
                  编号
                </template>
              </el-table-column>
              <el-table-column
                min-width="120px"
                sortable="custom"
                prop="fmc"
                label="名称"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="140px"
                sortable="custom"
                prop="fqc"
                label="全称"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fjs"
                label="级数"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fmx"
                label="明细"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fsort"
                label="序号"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                :formatter="bdepartmentfxsfformatter"
                sortable="custom"
                prop="fxsf"
                label="显示否"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fnote"
                label="备注"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="120px"
                sortable="custom"
                prop="fip"
                label="IP"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="120px"
                sortable="custom"
                prop="foperid"
                label="用户编号"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="120px"
                sortable="custom"
                prop="foperxm"
                label="用户名称"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="140px"
                sortable="custom"
                prop="dateCreated"
                label="创建日期"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="140px"
                sortable="custom"
                prop="lastUpdated"
                label="更新日期"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <!-- <el-table-column label="操作" align="center" width="145" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" class="mediabtn" @click="operate('edit',scope.row)">编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    class="mediabtn"
                    @click="handleDel('scope.$index',scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>-->
            </el-table>
          </div>
          <div class="grid-footer">
            <div ref="footer">
              <el-button
                type="button"
                size="mini"
                @click="batchDel"
                :disabled="this.sels.length === 0"
                >批量删除</el-button
              >
              <el-pagination
                @size-change="handlePage"
                @current-change="handleCurPage"
                :page-sizes="[20, 50, 100]"
                :page-size="max"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="float: right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </template>
    </split-pane>
    <el-dialog
      :title="title"
      :top="'5%'"
      :visible.sync="form.visible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        :model="form.fields"
        label-width="100px"
        inline-message
        :rules="form.rules"
        ref="form"
      >
        <el-form-item
          prop="pmc"
          class="mt"
          label="父节点"
          :error="form.errors.pmc"
        >
          <el-input
            v-model.number="form.fields.pmc"
            disabled
            placeholder="父节点"
          ></el-input>
        </el-form-item>
        <el-form-item prop="id" class="mt" label="编号" :error="form.errors.id">
          <el-input
            v-model.number="form.fields.id"
            disabled
            placeholder="编号"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="fmc"
          class="mt"
          label="名称"
          :error="form.errors.fmc"
        >
          <el-input v-model="form.fields.fmc" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item
          prop="fqc"
          class="mt"
          label="全称"
          :error="form.errors.fqc"
        >
          <el-input v-model="form.fields.fqc" placeholder="全称"></el-input>
        </el-form-item>
        <el-form-item
          prop="fjs"
          class="mt"
          label="级数"
          :error="form.errors.fjs"
        >
          <el-input
            v-model.number="form.fields.fjs"
            disabled
            placeholder="级数"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="fmx"
          class="mt"
          label="明细"
          :error="form.errors.fmx"
        >
          <el-input
            v-model.number="form.fields.fmx"
            disabled
            placeholder="明细"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="fsort" class="mt" label="序号" :error="form.errors.fsort">
          <el-input v-generator.number="form.fields.fsort" placeholder="序号"></el-input>
        </el-form-item>-->
        <el-form-item
          prop="fxsf"
          class="mt"
          label="显示否"
          :error="form.errors.fxsf"
        >
          <el-switch
            v-model="form.fields.fxsf"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item
          prop="fnote"
          class="mt mb"
          label="备注"
          :error="form.errors.fnote"
        >
          <el-input v-model="form.fields.fnote" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleSubmit"
          :loading="form.loading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import query from '../../mix/query'
import check from '../../mix/check'
import importer from '../../mix/importer'
import _ from 'lodash'
import { fileAction } from '../../api/file'
import util from '@/libs/util.js'

import {
  departmenttree,
  departmentlist,
  departmentdelete,
  departmentupdate,
  departmentsave,
  departmentnext,
  departmenchange,
  departmentdownload,
  departmentdeleteAll
} from '../../api/admin/bdepartment'
export default {
  name: 'department',
  mixins: [serversort, types, table, query, check, importer],
  data () {
    return {
      classicon: 'el-icon-minus',
      leftpanel: {
        icon: 'el-icon-d-arrow-left',
        width: 23
      },
      fileAction,
      tableAutoHeight: null,
      tableAutoHeightPX: null,
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'fbhmc'
      },
      title: '',
      showLoading: false,
      query: {
        name: 'department',
        treemx: false, // 是否包含下级
        tree: {}, // 树点击选中查询条件
        val: '',
        sort: 'fsort', // 默认排序列--通常是表格的第一列
        order: 'asc' // 默认排序方式
      },
      sels: [], // 列表选中列
      rows: [],
      total: 0,
      max: 20,
      offset: 0,
      currentPage: 0,
      isroot: true,
      form: {
        url: departmentsave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          pid: [
            { required: true, message: '父节点编号不能为空', trigger: 'blur' },
            { type: 'number', message: '父节点必须为数字', trigger: 'blur' }
          ],
          pmc: [
            { required: true, message: '父节点名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              message: '父节点名称必须为字符串',
              trigger: 'blur'
            }
          ],
          id: [
            { required: true, message: '编号不能为空', trigger: 'blur' },
            { type: 'string', message: '编号必须为字符串', trigger: 'blur' }
          ],
          fmc: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { type: 'string', message: '名称必须为字符串', trigger: 'blur' }
          ],
          fjs: [
            { required: true, message: '级数不能为空', trigger: 'blur' },
            { type: 'number', message: '级数必须为数字', trigger: 'blur' }
          ],
          fmx: [
            { required: true, message: '明细不能为空', trigger: 'blur' },
            { type: 'number', message: '明细必须为数字', trigger: 'blur' }
          ],
          // fsort: [{ required: true, message: '序号不能为空', trigger: 'blur' }, { type: 'number', message: '序号必须为数字', trigger: 'blur' }],
          fxsf: [
            { required: true, message: '显示否不能为空', trigger: 'blur' },
            { type: 'boolean', message: '显示否必须为条件', trigger: 'blur' }
          ],
          foperid: [
            { required: true, message: '用户编号不能为空', trigger: 'blur' },
            {
              type: 'string',
              message: '用户编号必须为字符串',
              trigger: 'blur'
            }
          ],
          foperxm: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              message: '用户名称必须为字符串',
              trigger: 'blur'
            }
          ]
        },
        treeRow: {},
        errors: {},
        fields: {
          pid: '',
          id: '',
          fmc: '',
          fqc: '',
          fjs: '',
          fmx: '',
          fsort: 0,
          fxsf: true,
          fnote: '',
          fip: '',
          foperid: '',
          foperxm: '',
          dateCreated: '',
          lastUpdated: ''
        }
      }
    }
  },
  // watch number 数据
  watch: {},
  mounted () {
    this.initQuery() // 初始化条件
    this.load()
    // this.$nextTick(() => {
    //   this.setHeight();
    //   this.setTableHeight();
    // });
    this.setTableHeight()
  },
  methods: {
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const footerHeight = this.$refs['footer'].parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      const dynamicSmallHeight = containerHeight - headerHeight
      this.tableAutoHeight = dynamicHeight
      this.tableSmallHeight = dynamicSmallHeight
      this.tableAutoHeightPX = containerHeight - footerHeight + 'px'
    },
    load () {
      this.selrow = {}
      this.showLoading = true
      const token = util.cookies.get('token')
      this.header = { token: token }
      let criteria = _.assign({}, this.query.tree) // 左侧树选中需要传递的条件
      const serversort = {} // 需要排序的数据，目前只进行单列排序处理
      serversort[this.query.sort] = this.query.order
      if (!_.isNil(this.query.val) && this.query.val !== '') {
        ;['id', 'fmc', 'fqc', 'fnote'].forEach((item) => {
          criteria[item] = `%${this.query.val}%`
        })
      }
      let params = _.assign(
        {},
        { max: this.max, offset: this.offset, tree: this.isroot },
        { sort: serversort },
        { criteria: { $or: criteria } }
      )
      // debugger
      departmentlist(params)
        .then((response) => {
          if (response.code === -100) {
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
          if (response.tree) {
            this.treedata = response.tree
          }
          this.max = response.max
          this.showLoading = false
          this.saveQuery() // 保存查询条件
        })
        .finally(() => {
          this.showLoading = false
        })
    },

    closeDialog () {
      this.$refs['form'].resetFields()
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
    // 删除角色
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true
          let params = { id: row.id }
          departmentdelete(params)
            .then((response) => {
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
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch((error) => {
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
      let ids = this.sels.map((item) => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(
        () => {
          this.showLoading = true
          let params = { ids: ids }
          departmentdeleteAll(params)
            .then((response) => {
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
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch((error) => {
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
      if (type === 'edit') {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...data })
        this.form.url = departmentupdate
      } else {
        if (_.isEmpty(this.treeRow)) {
          this.$notify({
            message: '请先在左侧树上选中一条数据',
            type: 'error'
          })
          return
        }
        this.title = '新增'
        if (type === 'addT') {
          // 同级增加
          const pid = _.get(this.treeRow, 'pid', '')
          if (pid === '') {
            this.$notify({
              message: '当前节点只能增加下级节点，不能增加平级节点',
              type: 'warning'
            })
            return
          }
          departmentnext({ fjs: data.fjs, id: data.id, fnote: 'T' }).then(
            (response) => {
              if (response.code === 100) {
                const isPrefix = response.isPrefix
                let id = response.fbh
                if (isPrefix) {
                  // 需要加前缀
                  id = data.id + id
                }
                this.form.fields = _.assign({}, { ...data }, { id })
              } else {
                this.$notify({
                  message: '增加节点出错',
                  type: 'error'
                })
              }
            }
          )
        } else {
          // 增加下级
          departmentnext({ fjs: data.fjs + 1, id: data.id, fnote: 'N' }).then(
            (response) => {
              if (response.code === 100) {
                const isPrefix = response.isPrefix
                let id = response.fbh
                if (isPrefix) {
                  // 需要加前缀
                  id = data.id + id
                }
                this.form.fields = _.assign(
                  {},
                  { ...data },
                  {
                    fjs: data.fjs + 1,
                    fmx: 1,
                    pmc: data.fmc,
                    id,
                    pid: data.id
                  }
                )
              } else {
                this.$notify({
                  message: '增加节点出错',
                  type: 'error'
                })
              }
            }
          )
        }
        this.form.visible = true
        this.reset()
        this.form.url = departmentsave
      }
    },
    close: function () {
      this.form.visible = false
      this.form.loading = false
      this.$refs['form'].resetFields()
    },
    handleSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            cancelButtonClass: 'el-button--mini',
            confirmButtonClass: 'el-button--mini',
            type: 'warning'
          }).then(
            () => {
              this.form.loading = true
              let params = _.assign({}, this.form.fields)
              this.form.url(params).then((response) => {
                let message = '提交成功'
                if (response.code === -100) {
                  this.form.loading = false
                  message = response.msg
                  this.$notify({
                    title: '提示',
                    message: response.msg,
                    type: 'error'
                  })
                  let errors = response.errors
                  errors.forEach((error) => {
                    this.form.errors[error.field] = _.get(
                      this.errorMsg,
                      error.message,
                      error.message
                    )
                  })
                  return
                }
                this.form.loading = false
                // this.$message({
                //     message: message,
                //     type: "success"
                // });
                this.$notify({
                  title: '提示',
                  message: message,
                  type: 'success'
                })
                this.form.visible = false
                this.reset()
                this.isroot = true
                this.load()
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
    // 批量删除
    batchDel: function () {
      let ids = this.sels.map((item) => item.id)
      this.$confirm('确认删除选中记录吗？', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(
        () => {
          this.showLoading = true
          let params = { ids: ids }
          departmentdeleteAll(params)
            .then((response) => {
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
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch((error) => {
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
            message: error,
            type: 'error'
          })
        }
      )
    },
    onNodeClick (data) {
      this.treeRow = data
      if (this.query.treemx) {
        this.query.tree = { id: `${data.id}%`, fjs: { $gt: data.fjs } }
      } else {
        this.query.tree = { id: `${data.id}%`, fjs: data.fjs + 1 }
      }
      this.isroot = false
      this.load()
    },
    reset: function () {
      this.form.fields = {
        pid: '',
        id: '',
        fmc: '',
        fqc: '',
        fjs: '',
        fmx: '',
        fsort: '',
        fxsf: true,
        fnote: '',
        fip: '',
        foperid: '',
        foperxm: '',
        dateCreated: '',
        lastUpdated: ''
      }
    },
    bdepartmentfxsfformatter (row, col, val) {
      return _.get({ true: '是', false: '否' }, val, '未找到')
    },
    // 拖拽结束处理
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
      console.log(this.treedata)
      debugger
      let id = draggingNode.data.id
      let parentid = ''
      if (dropType === 'inner') {
        parentid = dropNode.data.id
      }
      if (dropType === 'before' || dropType === 'after') {
        parentid = dropNode.data.pid
      }
      const params = {
        pid: parentid,
        id: id,
        type: dropType,
        node: dropNode.data.id
      }
      departmenchange(params).then((response) => {
        console.log(response)
      })
    },
    // 双击查下级
    onRowDblClick (row, col, event) {
      if (row.fmx === 0) {
        this.$refs.tree.setCurrentKey(row.id)
        if (this.query.treemx) {
          this.query.tree = { id: `${row.id}%`, fjs: { $gt: row.fjs } }
        } else {
          this.query.tree = { id: `${row.id}%`, fjs: row.fjs + 1 }
        }
        this.isroot = false
        this.load()
      }
    },
    onBack () {
      debugger
      const node = this.$refs.tree.getCurrentNode()
      const data = this.$refs.tree.getNode(node).parent.data
      if (!Array.isArray(data)) {
        this.$refs.tree.setCurrentKey(data.id)
        if (this.query.treemx) {
          this.query.tree = { id: `${data.id}%`, fjs: { $gt: data.fjs } }
        } else {
          this.query.tree = { id: `${data.id}%`, fjs: data.fjs + 1 }
        }
        this.isroot = false
        this.load()
      }
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = departmentupdate
      }
    },
    // 删除数据
    onDelete () {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    // 表格数据行点击
    onRowClick (row, col, event) {
      this.selrow = row
    },
    download () {
      const token = util.cookies.get('token')
      window.open(`${departmentdownload}?token=${token}`, '_blank')
    },
    loadTree () {
      departmenttree().then((response) => {
        this.treedata = [response]
      })
    },
    doCollapse () {
      if (this.leftpanel.icon === 'el-icon-d-arrow-left') {
        this.leftpanel = {
          width: 2,
          icon: 'el-icon-d-arrow-right'
        }
      } else {
        this.leftpanel = {
          width: 21,
          icon: 'el-icon-d-arrow-left'
        }
      }
    },
    doExpand () {
      const rows = document.querySelectorAll('.el-tree-node__expand-icon')
      rows.forEach((item) => {
        item.click()
      })
      if (this.classicon === 'el-icon-minus') {
        this.classicon = 'el-icon-plus'
      } else if (this.classicon === 'el-icon-plus') {
        this.classicon = 'el-icon-minus'
      }
    }
  }
}
</script>

<style scoped>
@import '~@/assets/style/common.scss';
/* .el-select .el-input {
    width: 120px;
  } */
.checkBoxTree {
  display: flex;
  align-items: center;
  margin-left: 10px;
  height: 28px;
}
.setHeight {
  overflow-y: scroll;
  overflow-x: scroll;
}
.tree {
  overflow-y: scroll;
  overflow-x: scroll;
}
.el-tree {
  min-width: 100%;
  display: inline-block;
}
.refreshTree {
  position: relative;
}

.refresh {
  position: absolute;
  right: 10px;
  top: 7px;
  z-index: 10;
}
.refresh:hover {
  cursor: pointer;
}
/* .el-form-item__label {*/
/*   line-height: 34px !important;*/
/* }*/
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
