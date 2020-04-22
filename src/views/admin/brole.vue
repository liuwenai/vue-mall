<template>
  <d2-container ref="container">
    <split-pane
      :style="{'height':tableAutoHeightPX}"
      :min-percent="16"
      :default-percent="83"
      split="vertical"
    >
      <template slot="paneL">
        <div class="grid-content bg-purple">
          <div class="grid-header">
            <el-form class="topHorizontal" :inline="true" id="headerDynamicHeight" ref="header">
              <div>
                <el-form-item v-for="(item,index) in query.cols" :key="index">
                  <el-input v-model="item.val" placeholder="查找" :clearable="true" @clear="load">
                    <el-select
                      style="width:110px;"
                      v-model="item.col"
                      slot="prepend"
                      placeholder="请选择"
                    >
                      <el-option label="角色" value="authority"></el-option>
                      <el-option label="显示否" value="fxsf"></el-option>
                      <el-option label="备注" value="fnote"></el-option>
                      <el-option label="用户名称" value="foperxm"></el-option>
                    </el-select>
                    <el-select
                      style="width:85px;"
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
                <el-form-item v-for="(item,index) in query.cols.length-1" :key="index">
                  <el-button type="primary" size="mini" @click="removeQuery(index)">删除</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="cleckquery">查询</el-button>
                  <el-button type="primary" size="mini" @click="groupQuery(4)">组合查询</el-button>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" size="mini" @click="operate('add')">新增</el-button>
                <el-button type="primary" :disabled="canOperate" size="mini" @click="onEdit">编辑</el-button>
                <el-button type="primary" :disabled="canOperate" size="mini" @click="onDelete">删除</el-button>
                <el-button type="primary" size="mini" @click="download">导出</el-button>
              </el-form-item>
              <el-form-item>
                <el-upload
                  :headers="header"
                  :show-file-list="showfile"
                  :on-progress="onProgress"
                  :action="fileAction('role','upload')"
                  :on-success="uploadSuccess"
                >
                  <el-button type="primary" size="mini" icon="upload">导入</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="grid-main">
            <el-table
              :data="rows"
              :height="tableAutoHeight"
              v-loading="showLoading"
              highlight-current-row
              border
              @selection-change="selsChange"
              @sort-change="onSortChange"
              @row-click="onRowClick"
              id="tableDynamicHeight"
            >
              <el-table-column type="selection" align="center" header-align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
              <el-table-column
                min-width="120px"
                sortable="custom"
                prop="authority"
                label="角色"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                :formatter="formmatfxsf"
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
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="fip"
                label="IP"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="110px"
                sortable="custom"
                prop="foperid"
                label="用户编号"
                show-overflow-tooltip
                header-align="center"
                text-align="left"
              ></el-table-column>
              <el-table-column
                min-width="110px"
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
                    class="mediabtn"
                    size="mini"
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
              >批量删除</el-button>
              <el-pagination
                @size-change="handlePage"
                @current-change="handleCurPage"
                :page-sizes="[20,50,100]"
                :page-size="max"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="float:right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </template>
      <template slot="paneR">
        <div class="grid-content bg-purple">
          <div class="grid-header setHeight" :style="{'height':tableAutoHeightPX}">
            <el-tree
              ref="tree"
              :data="treedata"
              highlight-current
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              show-checkbox
              node-key="id"
              :default-checked-keys="checkedTree"
              @check-change="onCheckChange"
              @node-click="onNodeClick"
            ></el-tree>
          </div>
          <div class="checkboxBtn">
            <el-button type="primary" @click="onSelectAll" size="mini">全选</el-button>
            <el-button type="primary" @click="onSelectRevert" size="mini">反选</el-button>
            <el-button type="primary" @click="onSaveRoleMenu" size="mini">保存</el-button>
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
        <el-form-item prop="authority" class="mt" label="角色" :error="form.errors.authority">
          <el-input v-model="form.fields.authority" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item prop="fxsf" class="mt" label="显示否" :error="form.errors.fxsf">
          <el-switch v-model="form.fields.fxsf" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item prop="fnote" class="mt mb" label="备注" :error="form.errors.fnote">
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
        >提交</el-button>
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
import util from '@/libs/util.js'

import { mapActions } from 'vuex'
import {
  roleMenusave,
  rolemenu,
  rolelist,
  roledelete,
  roledeleteAll,
  roleupdate,
  rolesave,
  roledownload
} from '../../api/admin/brole'
import { fileAction } from '../../api/file'

export default {
  name: 'role',
  mixins: [serversort, types, table, query, check, importer],
  data () {
    return {
      fileAction,
      tableAutoHeight: null,
      tableAutoHeightPX: null,
      selectRole: {}, // 选中行角色
      treedata: [],
      treeids: [],
      checkedTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      title: '',
      showLoading: false,
      query: {
        name: 'role', // 查询保存的名称
        cols: [{ val: '', type: '%' }], // 需要组合查询的列参数
        sort: 'authority', // 默认排序列--通常是表格的第一列
        order: 'asc' // 默认排序方式
      },
      sels: [], // 列表选中列
      rows: [
        // {
        //   authority: "ROLE_ADMIN",
        //   fxsf: true,
        //   fnote: "管理员角色",
        //   fip: "127.0.0.1",
        //   foperid: "admin",
        //   foperxm: "管理员",
        //   dateCreated: "2019-03-52 20:25:52",
        //   lastUpdated: "2019-03-52 20:25:52",
        //   id: 1
        // },
      ],
      total: 0,
      max: 20,
      offset: 0,
      currentPage: 0,
      isroot: true,
      form: {
        url: rolesave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          authority: [
            { required: true, message: '角色不能为空', trigger: 'blur' },
            { type: 'string', message: '角色必须为字符串', trigger: 'blur' }
          ],
          fxsf: [
            { required: true, message: '显示否不能为空', trigger: 'blur' },
            { type: 'boolean', message: '显示否必须为条件', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: {
          authority: '',
          fxsf: false,
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
    // this.initQuery() // 初始化条件
    this.load()
    // this.$nextTick(()=>{
    //     this.setHeight();
    // })
    // this.setTableHeight()
    // this.setHeight()
  },
  methods: {
    ...mapActions('d2admin/db', ['database', 'databaseClear']),
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const footerHeight = this.$refs['footer'].parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      const dynamicSmallHeight = containerHeight - headerHeight
      this.tableAutoHeight = dynamicHeight
      this.tableAutoHeightPX = containerHeight - footerHeight + 'px'
      this.tableSmallHeight = dynamicSmallHeight
    },
    load () {
      //  const db =  await this.database()
      // const dataDisplay = JSON.stringify(db.value(), null, 2)
      // if(dataDisplay!=null){
      //   this.query = JSON.parse(dataDisplay).role;
      // }
      this.selrow = {}
      this.showLoading = true
      let criteria = {} // 左侧树选中需要传递的条件
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
      rolelist(params)
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
          this.$nextTick(() => {
            this.setTableHeight()
          })
        })
    },
    closeDialog () {
      this.$refs['form'].resetFields()
      //                this.$refs["addForm"].resetFields();
      //                this.selectBm = {};
    },
    async cleckquery () {
      this.writetodata('role')
      this.load()
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
          roledelete(params)
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
              // debugger;
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
          roledeleteAll(params)
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
        this.form.url = roleupdate
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = rolesave
      }
    },
    close: function () {
      this.form.visible = false
      this.form.loading = false
      this.$refs['form'].resetFields()
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
                    message = response.msg
                    this.$notify({
                      title: '提示',
                      message: response.msg,
                      type: 'error'
                    })
                    let errors = response.errors
                    errors.forEach(error => {
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
        authority: '',
        fxsf: false,
        fnote: '',
        fip: '',
        foperid: '',
        foperxm: '',
        dateCreated: '',
        lastUpdated: ''
      }
    },
    onRowClick (row, column, event) {
      this.selrow = row
      rolemenu({ id: row.id })
        .then(response => {
          if (response.code === -100) {
            this.$notify({
              title: '提示',
              message: response.msg,
              type: 'error'
            })
            // this.showLoading = false;
            return
          }
          this.treedata = response.allMenus
          this.treeids = response.allIds
          this.checkedTree = response.grantMenus
          this.selectRole = row

          //   this.showLoading = false;
        })
        .finally(() => {
          //   this.showLoading = false;
        })
      this.selrow = row
    },
    onNodeClick () {},
    onCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate);
    },
    onSaveRoleMenu () {
      const selectednodes = this.$refs.tree.getCheckedKeys()
      if (selectednodes.length <= 0) {
        this.$notify({
          title: '提示',
          message: '请选择至少一条菜单数据',
          type: 'error'
        })
        return
      }
      const params = { id: this.selectRole.id, menus: selectednodes }
      // debugger;
      roleMenusave(params).then(res => {
        this.$notify({
          title: '提示',
          message: res.msg,
          type: 'success'
        })
      })
    },
    onSelectAll () {
      // 根据菜单数据设置选中的节点
      this.$refs.tree.setCheckedKeys([this.treedata[0].id])
    },
    onSelectRevert () {
      const treeids = this.treeids
      const selectednodes = this.$refs.tree.getCheckedKeys()
      const otherid = _.difference(treeids, selectednodes)
      this.$refs.tree.setCheckedKeys(otherid)
    },
    async writetodata (name) {
      const db = await this.database()
      db.set(name, this.query).write()
      console.log(db)
      this.load()
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = roleupdate
      }
    },
    // 删除数据
    onDelete () {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    download () {
      const token = util.cookies.get('token')
      window.open(`${roledownload}?token=${token}`, '_blank')
    }
  }
}
</script>

<style scoped>
@import "~@/assets/style/common.scss";
/* .el-select .el-input {
  width: 120px;
} */
/*.el-form-item__label{*/
/*  line-height:34px;*/
/*}*/
.checkboxBtn {
  display: flex;
  align-items: center;
}
.setHeight {
  overflow-y: scroll;
  z-index: 10;
  background: #fff;
}
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
