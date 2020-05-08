<template>
  <d2-container ref="container">
    <el-row class="tyyks-row">
      <el-col :span="24" v-if="showheader">
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
                      v-model="item.col"
                      slot="prepend"
                      placeholder="请选择"
                      style="width:110px;"
                    >
                      <el-option label="账号" value="userzh"></el-option>
                      <el-option label="用户名" value="usermc"></el-option>
                      <el-option label="电话" value="phone"></el-option>
                      <el-option label="密码" value="password"></el-option>
                    </el-select>
                    <el-select
                      v-model="item.type"
                      slot="append"
                      placeholder="请选择"
                      style="width:70px;"
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
                    >删除</el-button
                  >
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="load"
                    >查询</el-button
                  >
                  <el-button type="primary" size="mini" @click="groupQuery(16)"
                    >组合查询</el-button
                  >
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" size="mini" @click="operate('add')"
                  >新增</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="canOperate"
                  @click="onEdit"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="canOperate"
                  @click="onDelete"
                  >删除</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="grid-main">
            <el-table
              :element-loading-text="loadingtext"
              element-loading-spinner="el-icon-loading"
              ref="tableHeader"
              :height="firstTableHeight"
              :data="rows"
              v-loading="showLoading"
              highlight-current-row
              border
              @selection-change="selsChange"
              @sort-change="onSortChange"
              @row-click="onRowClick"
              stripe
            >
              <!-- <el-table-column
                type="selection"
                header-align="center"
                align="center"
              ></el-table-column> -->
              <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
              <el-table-column
                min-width="130px"
                sortable="custom"
                prop="userzh"
                label="账号"
                show-overflow-tooltip
                align="center"
                header-align="center"
              ></el-table-column>
              <el-table-column
                min-width="110px"
                sortable="custom"
                prop="usermc"
                label="用户名"
                show-overflow-tooltip
                align="center"
                header-align="center"
              ></el-table-column>
              <el-table-column
                min-width="90px"
                sortable="custom"
                prop="phone"
                label="电话"
                show-overflow-tooltip
                align="center"
                header-align="center"
              ></el-table-column>
              <el-table-column
                min-width="140px"
                sortable="custom"
                prop="password"
                label="密码"
                show-overflow-tooltip
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                min-width="140px"
                sortable="custom"
                prop="admin"
                label="管理员"
                show-overflow-tooltip
                align="center"
                :formatter="booleanFormatter"
                header-align="center"
              ></el-table-column>
            </el-table>
          </div>
          <div class="grid-footer">
            <div ref="footer">
              <el-pagination
                @size-change="handlePage"
                @current-change="handleCurPage"
                :page-sizes="[20, 50, 200]"
                :page-size="max"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="float:right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="grid-main">
            <el-tabs  type="border-card" v-model="tabname">
              <el-tab-pane label="地址管理" name="tabaddress">
                <el-table
                  class="click-table"
                  ref="elxAddress"
                  :height="childTableHeight"
                  :data="addresslist"
                  v-loading="showLoading"
                  highlight-current-row
                  stripe
                  border
                  @selection-change="selsChange"
                  @sort-change="onSortChange"
                >
                  <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
                  ></el-table-column>
                  <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="fsjrxm"
                    label="收件人姓名"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fsjrdh"
                    label="收件人电话"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="90px"
                    sortable="custom"
                    prop="address"
                    label="地址"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="订单管理" name="taborder">
                <el-table
                  ref="elxOrder"
                  class="click-table"
                  :height="childTableHeight"
                  :data="orderlist"
                  v-loading="showLoading"
                  highlight-current-row
                  stripe
                  border
                  @selection-change="selsChange"
                  @sort-change="onSortChange"
                >
                  <!-- <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                  ></el-table-column> -->
                  <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
                  ></el-table-column>
                  <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="fddname"
                    label="订单人姓名"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fdddh"
                    label="订单电话"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="fdddz"
                    label="订单地址"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="140px"
                    sortable="custom"
                    prop="fddbh"
                    label="订单编号"
                    show-overflow-tooltip
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="140px"
                    sortable="custom"
                    prop="fddsj"
                    label="订单时间"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fddsl"
                    label="订单数量"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fdddj"
                    label="订单单价"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fddje"
                    label="订单金额"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fddyf"
                    label="订单邮费"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="fddzt"
                    label="订单状态"
                    show-overflow-tooltip
                    align="left"
                    header-align="center"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-dialogDrag
      :title="title"
      :top="'5%'"
      :visible.sync="form.visible"
      :close-on-click-modal="false"
      @close="closeDialog('form')"
    >
      <el-form
        :model="form.fields"
        label-width="100px"
        :rules="form.rules"
        ref="form"
      >
        <!-- <el-form-item prop="fdwbh" label="单位编号" :error="form.errors.fdwbh">
          <el-input v-model="form.fields.fdwbh" placeholder="单位编号"></el-input>
        </el-form-item>-->
        <el-form-item prop="userzh" label="账号" :error="form.errors.userzh">
          <el-input v-model="form.fields.userzh" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="usermc" label="用户名" :error="form.errors.usermc">
          <el-input
            v-model="form.fields.usermc"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话" :error="form.errors.phone">
          <el-input v-model="form.fields.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :error="form.errors.password"
        >
          <el-input
            v-model="form.fields.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="admin"
          label="管理员"
          :error="form.errors.admin"
        >
          <el-input
            v-model="form.fields.admin"
            disabled
            placeholder="管理员"
          ></el-input>
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
// import { fileAction, fileExport } from "../../api/base/file";
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import query from '../../mix/query'
import importer from '../../mix/importer'
import check from '../../mix/check'
import _ from 'lodash'
import {
  userlist,
  userdelete,
  userupdate,
  usersave,
  usershow
} from '../../api/mall/user.js'

export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      addresslist:[],
      orderlist:[],
      tabname:"tabaddress",
      showheader: true,
      firstTableHeight: 100, // 第一个表格高度
      containerHeight: 400,
      childTableHeight: 100,
      childTempHeight: 100,
      autotableHeight: 100,
      downloadparams: {},
      btntitle: '',
      title: '',
      showLoading: false,
      query: {
        name: 'user',
        cols: [{ val: '', type: '%' }],
        sort: 'dateCreated',
        order: 'asc',
      },
      sels: [], // 列表选中列
      rows: [],
      total: 0,
      max: 20,
      offset: 0,
      currentPage: 0,
      form: {
        url: usersave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          userzh: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
            { type: 'string', message: '账号必须为字符串', trigger: 'blur' },
          ],
          usermc: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', message: '用户名必须为字符串', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '电话不能为空', trigger: 'blur' },
            { type: 'string', message: '电话必须为字符串', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', message: '密码必须为字符串', trigger: 'blur' },
          ],
        },
        errors: {},
        fields: {
          userzh: '',
          usermc: '',
          phone: '',
          password: '',
          admin: false,
        },
      },
    }
  },
  // watch number 数据
  watch: {
    query: {
      handler(nv, ov) {
        this.load()
      },
      deep: true,
    },
  },
  mounted() {
    this.initQuery()
    this.load()
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  methods: {
    setTableHeight: function() {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const footerHeight = this.$refs['footer'].parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight - footerHeight - 54
      this.autotableHeight = dynamicHeight
      this.tableHeight = dynamicHeight
      this.containerHeight = containerHeight
      this.childTableHeight = dynamicHeight / 2
      this.firstTableHeight = dynamicHeight / 2
      this.childTempHeight = dynamicHeight / 2
    },

    load() {
      this.selrow = {}
      this.showLoading = true
      let criteria = {}
      const serversort = {}
      serversort[this.query.sort] = this.query.order
      this.query.cols.forEach((item) => {
        if (item.col) {
          criteria[item.col] = item.type + item.val + item.type
        }
      })

      let params = _.assign(
        {},
        { max: this.max, offset: this.offset },
        { sort: serversort },
        { criteria: criteria }
      )
      this.downloadparams = params
      userlist(params)
        .then((response) => {
          if (response.code === -100) {
            this.$notify({
              title: '提示',
              message: response.msg,
              type: 'error',
            })
            this.showLoading = false
            return
          }
          this.rows = response.rows
          this.total = response.total
          this.max = response.max
          this.showLoading = false
        })
        .finally(() => {
          this.showLoading = false
        })

      this.$nextTick(() => {
        this.setTableHeight()
      })
    },
    closeDialog: function(name) {
      this.$refs[name].clearValidate()

      //                this.$refs["addForm"].resetFields();
      //                this.selectBm = {};
    },
    // 多选调用方法
    selsChange: function(sels) {
      this.sels = sels
    },
    // 分页操作方法
    handlePage(val) {
      this.max = val
      this.offset = this.max * this.currentPage
      this.load()
    },
    handleCurPage(val) {
      this.currentPage = val - 1
      if (this.currentPage <= -1) {
        this.currentPage = 0
      }
      this.offset = this.max * this.currentPage
      this.load()
    },
    // 删除角色
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning',
      })
        .then(() => {
          this.showLoading = true
          let params = { id: row.id }
          userdelete(params)
            .then((response) => {
              if (response.code === -100) {
                this.$notify({
                  title: '提示',
                  message: response.msg,
                  type: 'error',
                })
                this.showLoading = false
                return
              }
              this.showLoading = false
              this.$notify({
                message: '删除成功',
                type: 'success',
              })
              this.load()
            })
            .catch((error) => {
              this.showLoading = false
              this.$notify({
                title: '提示',
                message: error,
                type: 'error',
              })
            })
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            message: '取消操作',
            type: 'info',
          })
        })
    },
    operate: function(type, data) {
      this.form.visible = true
      if (type === 'edit') {
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...data })
        this.form.url = userupdate
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = usersave
      }
    },
    close: function() {
      this.form.visible = false
      this.form.loading = false
    },
    handleSubmit: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            cancelButtonClass: 'el-button--mini',
            confirmButtonClass: 'el-button--mini',
          }).then(
            () => {
              this.form.loading = true
              let params = _.assign({}, this.form.fields)
              this.form
                .url(params)
                .then((response) => {
                  let message = '提交成功'
                  if (response.code === -100) {
                    this.form.loading = false
                    message = response.msg
                    this.$message.error(response.msg)
                    let errors = response.errors
                    errors.forEach((error) => {
                      this.form.errors[error.field] = error.message
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
                    type: 'success',
                  })
                  this.form.visible = false
                  this.reset()
                  this.load()
                })
                .catch((error) => {
                  this.form.loading = false
                  this.$notify({
                    title: '提示',
                    message: error,
                    type: 'error',
                  })
                })
            },
            () => {
              this.$notify({
                title: '提示',
                message: '取消操作',
                type: 'info',
              })
            }
          )
        }
      })
    },
    reset: function() {
      this.form.fields = {
        userzh: '',
        usermc: '',
        phone: '',
        password: '',
        admin: false,
      }
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = userupdate
      }
    },
    // 删除数据
    onDelete() {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    // 表格数据行点击
    onRowClick(row, col, event) {
      this.selrow = row
      this.loadAddre();
      // this.loadOrder();
    },
    loadAddre(){
      this.addresslist = this.selrow.addresses
    }
  },
}
</script>

<style>
@import '~@/assets/style/common.scss';
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
