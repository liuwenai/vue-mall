<template>
  <d2-container ref="container">
    <SplitPane
            :style="{ height: tableAutoHeightPX }"
            :min-percent="16"
            :default-percent="17"
            split="vertical"
    >
      <template slot="paneL">
        <div class="grid-content bg-purple">
          <div
                  class="grid-header setHeight refreshTree"
                  :style="{ height: tableAutoHeightPX }"
          >
            <el-tree
                    :data="treedata"
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
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
              <div>
                <el-form-item v-for="(item, index) in query.cols" :key="index">
                  <el-input
                          v-model="item.val"
                          placeholder="查找"
                          :clearable="true"
                          @clear="load"
                  >
                    <el-select
                            style="width:120px;"
                            v-model="item.col"
                            slot="prepend"
                            placeholder="请选择"
                    >
                      <el-option label="父节点" value="pid"></el-option>
                      <el-option label="编号" value="id"></el-option>
                      <el-option label="名称" value="title"></el-option>
                      <el-option label="图标" value="icon"></el-option>
                      <el-option label="组件" value="component"></el-option>
                      <el-option label="序号" value="forder"></el-option>
                      <el-option label="显示否" value="fxsf"></el-option>
                      <el-option label="备注" value="fnote"></el-option>
                      <el-option label="用户名称" value="foperxm"></el-option>
                    </el-select>
                    <el-select
                            style="width:90px;"
                            v-model="item.type"
                            slot="append"
                            placeholder="请选择"
                    >
                      <el-option label="模糊" value="%"></el-option>
                      <el-option label="精确" value></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                        v-for="(item, index) in query.cols.length - 1"
                        :key="index"
                >
                  <el-button
                          type="primary"
                          size="mini"
                          @click="removeQuery(index)"
                  >
                    删除
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="load">
                    查询
                  </el-button>
                  <!-- <el-button type="primary" size="mini" @click="groupQuery(9)">组合查询</el-button> -->
                  <!--<el-button type="primary" size="mini" @click="operate('add')">新增</el-button>-->
                  <el-button
                          type="primary"
                          size="mini"
                          :loading="btntitle === '初始化'"
                          @click="initMenu"
                  >
                    初始化
                  </el-button>
                  <el-button
                          type="primary"
                          :disabled="canOperate"
                          size="mini"
                          @click="onEdit"
                  >编辑
                  </el-button>
                  <el-button
                          type="primary"
                          :disabled="canOperate"
                          size="mini"
                          @click="onDelete"
                  >删除</el-button
                  >
                </el-form-item>
              </div>
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
            >
              <el-table-column
                      type="selection"
                      header-align="center"
                      align="center"
              ></el-table-column>
              <!-- <el-table-column type="index" label="序号" width="70" align="center"></el-table-column> -->
              <el-table-column
                      min-width="100px"
                      sortable="custom"
                      prop="id"
                      label="编号"
                      show-overflow-tooltip
                      header-align="center"
                      text-align="left"
              ></el-table-column>
              <el-table-column
                      min-width="90px"
                      sortable="custom"
                      prop="pid"
                      label="父节点"
                      show-overflow-tooltip
                      align="center"
              ></el-table-column>
              <el-table-column
                      min-width="120px"
                      sortable="custom"
                      prop="title"
                      label="名称"
                      show-overflow-tooltip
                      header-align="center"
                      text-align="left"
              ></el-table-column>
              <el-table-column
                      min-width="90px"
                      sortable="custom"
                      prop="icon"
                      label="图标"
                      header-align="center"
                      show-overflow-tooltip
                      text-align="left"
              ></el-table-column>
              <el-table-column
                      min-width="90px"
                      sortable="custom"
                      show-overflow-tooltip
                      prop="component"
                      label="组件"
                      align="center"
              ></el-table-column>
              <el-table-column
                      min-width="90px"
                      sortable="custom"
                      show-overflow-tooltip
                      prop="forder"
                      label="序号"
                      align="center"
              ></el-table-column>
              <el-table-column
                      min-width="90px"
                      :formatter="bmenufxsfformatter"
                      sortable="custom"
                      prop="fxsf"
                      show-overflow-tooltip
                      label="显示否"
                      align="center"
              ></el-table-column>
              <!-- <el-table-column
              min-width="90px"
              sortable="custom"
              prop="actions"
              label="actions"
              align="center"
              ></el-table-column>-->
              <el-table-column
                      min-width="90px"
                      sortable="custom"
                      prop="fnote"
                      label="备注"
                      show-overflow-tooltip
                      header-align="center"
                      text-align="left"
              ></el-table-column>
              <!-- <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fip"
                label="IP"
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
              ></el-table-column>-->
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

              <!-- <el-table-column
                label="操作"
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
              >删除</el-button>-->
              <!-- </template>
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
                      style="float:right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </template>
    </SplitPane>
    <el-dialog
            :title="title"
            :top="'5%'"
            :visible.sync="form.visible"
            :close-on-click-modal="false"
            @close="closeDialog"
            class="header-bmenu"
    >
      <el-form
              :model="form.fields"
              label-width="100px"
              :rules="form.rules"
              ref="form"
      >
        <el-form-item
                prop="pid"
                class="mt"
                label="父节点"
                :error="form.errors.pid"
        >
          <el-input
                  v-model.number="form.fields.pid"
                  placeholder="父节点"
          ></el-input>
        </el-form-item>
        <el-form-item
                prop="path"
                class="mt"
                label="编号"
                :error="form.errors.path"
        >
          <el-input v-model="form.fields.path" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item
                prop="title"
                class="mt"
                label="名称"
                :error="form.errors.title"
        >
          <el-input v-model="form.fields.title" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item
                prop="icon"
                class="mt"
                label="图标"
                :error="form.errors.icon"
        >
          <template>
            <d2-icon-select v-model="form.fields.icon" :user-input="true" />
          </template>
          <!--<el-input v-model="form.fields.icon" placeholder="图标"></el-input>-->
        </el-form-item>
        <el-form-item
                prop="component"
                class="mt"
                label="组件"
                :error="form.errors.component"
        >
          <el-input
                  v-model="form.fields.component"
                  placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item
                prop="forder"
                class="mt"
                label="序号"
                :error="form.errors.forder"
        >
          <el-input-number
                  v-model="form.fields.forder"
                  :min="1"
          ></el-input-number>
        </el-form-item>
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
        <!-- <el-form-item prop="actions" class="mt" label="actions" :error="form.errors.actions">
          <el-input v-model="form.fields.actions" placeholder="actions"></el-input>
        </el-form-item>-->
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
        <el-button @click.native="close('form')" size="mini">取消</el-button>
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
import menuHeader from '@/menu/header'
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import query from '../../mix/query'
import check from '../../mix/check'
import _ from 'lodash'
import {
  menudelete,
  menudeleteAll,
  menuupdate,
  menusave,
  menulist,
  menuinit
} from '../../api/admin/bmenu'
export default {
  name: 'bmenu',
  mixins: [serversort, types, table, query, check],
  data () {
    return {
      btntitle: '',
      tableAutoHeight: null,
      tableAutoHeightPX: null,
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      title: '',
      showLoading: false,
      treeRow: {},
      query: {
        name: 'menu',
        treemx: false, // 是否包含下级
        tree: {}, // 树点击选中查询条件
        cols: [{ val: '', type: '%' }], // 需要组合查询的列参数
        sort: 'pid', // 默认排序列--通常是表格的第一列
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
        url: menusave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          pid: [{ required: true, message: '父节点不能为空', trigger: 'blur' }],
          path: [
            { required: true, message: '编号不能为空', trigger: 'blur' },
            { type: 'string', message: '编号必须为字符串', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { type: 'string', message: '名称必须为字符串', trigger: 'blur' }
          ],
          forder: [
            { required: true, message: '序号不能为空', trigger: 'blur' },
            { type: 'number', message: '序号必须为数字', trigger: 'blur' }
          ],
          fxsf: [
            { required: true, message: '显示否不能为空', trigger: 'blur' },
            { type: 'boolean', message: '显示否必须为条件', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: {
          pid: '',
          path: '',
          title: '',
          icon: '',
          component: '',
          forder: '',
          fxsf: true,
          actions: '',
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
  watch: {
    query: {
      handler (nv, ov) {
        this.load()
      },
      deep: true
    }
  },
  mounted () {
    this.initQuery() // 初始化条件
    this.load()
    // this.$nextTick(() => {
    //   this.setHeight();
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
      this.tableAutoHeightPX = containerHeight + 'px'
    },
    onNodeClick (data) {
      this.treeRow = data
      if (this.query.treemx) {
        this.query.tree = { id: data.id }
      } else {
        this.query.tree = { pid: `${data.id}%` }
      }
      this.isroot = false
      this.load()
    },
    load () {
      this.showLoading = true
      this.selrow = {}
      let criteria = _.assign({}, this.query.tree) // 左侧树选中需要传递的条件
      const serversort = {} // 需要排序的数据，目前只进行单列排序处理
      serversort[this.query.sort] = this.query.order
      this.query.cols.forEach(item => {
        if (!_.isEmpty(item.col)) {
          criteria[item.col] = item.type + item.val + item.type
        }
      })
      let params = _.assign(
        {},
        { max: this.max, offset: this.offset, tree: this.isroot },
        { sort: serversort },
        { criteria: criteria }
      )
      menulist(params)
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
    initMenu () {
      this.btntitle = '初始化'
      menuinit(menuHeader).then(res => {
        const { code, msg } = res
        if (code === 100) {
          this.$notify({
            title: '提示',
            message: msg,
            type: 'success'
          })
        }
      }).finally(() => {
        this.btntitle = ''
      })
      // menuinitAction().then(response => {
      //   this.$notify({
      //     title: '提示',
      //     message: response.msg,
      //     type: 'success'
      //   })
      // })
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
          menudelete(params)
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
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(
        () => {
          this.showLoading = true
          let params = { ids: ids }
          menudeleteAll(params)
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
        this.form.fields = _.assign({}, { ...data })
        this.form.url = menuupdate
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = menusave
      }
    },
    close: function (name) {
      this[name].visible = false
      this[name].loading = false
      // this.$refs[name].clearValidate();
    },
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            cancelButtonClass: 'el-button--mini',
            confirmButtonClass: 'el-button--mini',
            type: 'warning'
          }).then(
            () => {
              this.form.loading = true
              let params = _.assign({}, this.form.fields)
              this.form
                .url(params)
                .then(response => {
                  let message = '提交成功'
                  if (response.code === -100) {
                    this.form.loading = false
                    // message = response.msg;
                    this.$notify({
                      title: '提示',
                      message: response.msg,
                      type: 'error'
                    })
                    let errors = response.errors.errors
                    errors.forEach(error => {
                      this.form.errors[error.field] = error.message
                    })
                    this.$refs.form.validate()
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
      this.form.fields = {
        pid: '',
        path: '',
        name: '',
        icon: '',
        component: '',
        forder: '',
        fxsf: true,
        actions: '',
        fnote: '',
        fip: '',
        foperid: '',
        foperxm: '',
        dateCreated: '',
        lastUpdated: ''
      }
    },

    bmenufxsfformatter (row, col, val) {
      return _.get({ true: '是', false: '否' }, val, '未找到')
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = menuupdate
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
    }
  }
}
</script>

<style>
  @import "~@/assets/style/common.scss";
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
  /*.el-form-item__label{*/
  /*  line-height:34px!important;*/
  /*}*/
  /*.el-table .cell, .el-table th>div {*/
  /*padding-left:5px;*/
  /*padding-right:5px;*/
  /*}*/
</style>
