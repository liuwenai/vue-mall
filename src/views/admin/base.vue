<template>
  <d2-container ref="container">
    <el-row class="tyyks-row">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="grid-header">
            <el-form class="topHorizontal" :inline="true" ref="header">
              <div>
                <!-- <el-form-item>
                                    <el-input  clearable v-model='query.fuzzy' placeholder='模糊查找'></el-input>
                </el-form-item>-->
                <el-form-item v-for="(item, index) in query.cols" :key="index">
                  <el-input
                    v-model="item.val"
                    placeholder="查找"
                    :clearable="true"
                    @clear="load"
                  >
                    <el-select
                      style="width: 120px;"
                      v-model="item.col"
                      slot="prepend"
                      placeholder="请选择"
                    >
                      <el-option label="模型" value="fdomain"></el-option>
                      <el-option label="描述" value="fdesc"></el-option>
                    </el-select>
                    <el-select
                      style="width: 80px;"
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
                <el-form-item>
                  <el-radio-group v-model="query.ftype" @change="changeType">
                    <el-radio label="01">导入</el-radio>
                    <el-radio label="02">导出</el-radio>
                    <el-radio label="03">在线Excel</el-radio>
                    <el-radio label="04">多维查询</el-radio>
                  </el-radio-group>
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
                  <el-button
                    type="primary"
                    size="mini"
                    @click="load"
                    icon="search"
                    >查询</el-button
                  >
                  <el-button
                    type="primary"
                    :loading="btnInit"
                    size="mini"
                    @click="onInit"
                    icon="plus"
                    >初始化</el-button
                  >

                  <el-button type="primary" size="mini" @click="groupQuery(2)"
                    >组合查询</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="operate('add')"
                    icon="plus"
                    >新增</el-button
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
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="grid-main">
            <el-table
              :height="tableAutoHeight / 2"
              :data="rows"
              v-loading="showLoading"
              highlight-current-row
              border
              @sort-change="onSortChange"
              @row-click="showDetail"
            >
              <!--<el-table-column type='selection'></el-table-column>-->
              <el-table-column
                type="index"
                label="序号"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fdomain"
                width="280"
                sortable="custom"
                label="模型"
                align="left"
                header-align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="fdesc"
                label="描述"
                align="left"
                header-align="center"
                sortable="custom"
                width="220"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="fsheet"
                label="Excel工作表"
                v-if="!pivot"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fsum"
                label="汇总方式"
                v-if="pivot"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fsumcol"
                label="汇总列"
                v-if="pivot"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fstart"
                label="开始行"
                v-if="!pivot"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fend"
                label="结束行"
                v-if="!pivot"
                align="center"
              ></el-table-column>

              <!-- <el-table-column label="操作" align="center" width="145" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" @click="operate('edit',scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel('cope.$index',scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>-->
            </el-table>
          </div>
          <div class="grid-footer footerBtnx">
            <div ref="footer">
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
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="grid-main">
            <!--明细-->
            <el-table-draggable @drop="onDrop" handle=".handle">
              <el-table
                :height="tableAutoHeight / 2"
                :data="detailrows"
                v-loading="showLoading"
                highlight-current-row
                border
                :row-class-name="row"
                :default-sort="{ prop: 'forder', order: 'ascending' }"
              >
                <!-- <el-table-column type="selection"></el-table-column> -->
                <!-- <el-table-column type="index" label="序号" width="70" align="center"></el-table-column> -->
                <el-table-column
                  prop="forder"
                  label="序号"
                  align="center"
                  sortable
                  width="80"
                ></el-table-column>
                <el-table-column
                  prop="fcol"
                  label="模型列"
                  align="left"
                  header-align="center"
                  sortable
                  width="120"
                ></el-table-column>
                <el-table-column
                  prop="fcolmc"
                  label="模型列名称"
                  align="left"
                  header-align="center"
                  sortable
                  width="170"
                ></el-table-column>
                <el-table-column
                  prop="fcell"
                  label="Excel单元格列"
                  align="center"
                  sortable
                  width="130"
                ></el-table-column>
                <el-table-column
                  prop="ftype"
                  label="类型"
                  align="center"
                  sortable
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="ffunc"
                  label="函数"
                  align="center"
                  sortable
                  width="100"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="fdisplay"
                  label="显示列"
                  align="center"
                  sortable
                  width="100"
                ></el-table-column>
                <el-table-column
                  width="120"
                  label="启用否"
                  sortable
                  align="center"
                  :filters="[
                    { text: '启用', value: true },
                    { text: '不启用', value: false },
                  ]"
                  :filter-method="filterFqy"
                  prop="fqy"
                >
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.fqy" disabled></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fshow"
                  label="显示方式"
                  align="center"
                  :formatter="formmatshow"
                  sortable
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="fdefault"
                  label="默认值"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="fnote"
                  label="备注"
                  align="center"
                ></el-table-column>

                <el-table-column
                  label="操作"
                  align="center"
                  width="145"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" @click="operatemx('edit', scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelmx('scope.$index', scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-table-draggable>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      class="header-base"
      :title="title"
      :top="'5%'"
      :visible="form.visible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form
        :model="form.fields"
        label-width="100px"
        :rules="form.rules"
        ref="form"
      >
        <el-form-item
          prop="fdomain"
          class="mt"
          label="模型"
          :error="form.errors.fdomain"
        >
          <el-input v-model="form.fields.fdomain" placeholder="模型"></el-input>
        </el-form-item>

        <el-form-item
          prop="fdesc"
          class="mt"
          label="描述"
          :error="form.errors.fdesc"
        >
          <el-input
            v-model="form.fields.fdesc"
            type="textarea"
            placeholder="描述"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="fsheet"
          class="mt"
          v-if="!pivot"
          label="Excel工作表"
          :error="form.errors.fsheet"
        >
          <el-input
            v-model="form.fields.fsheet"
            placeholder="Excel工作表"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="fsum"
          class="mt"
          v-if="pivot"
          label="汇总方式"
          :error="form.errors.fsum"
        >
          <el-select v-model="form.fields.fsum" placeholder="请选择">
            <el-option
              v-for="item in pivotType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="fsumcol"
          class="mt"
          v-if="pivot"
          label="汇总列"
          :error="form.errors.fsumcol"
        >
          <el-select v-model="form.fields.fsumcol" placeholder="请选择">
            <el-option
              v-for="item in form.row.cols"
              :key="item.fcolmc"
              :label="item.fcolmc"
              :value="item.fcolmc"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!pivot"
          class="mt"
          prop="fstart"
          label="开始行"
          :error="form.errors.fstart"
        >
          <el-input-number
            v-model="form.fields.fstart"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          v-if="!pivot"
          class="mt mb"
          prop="fend"
          label="结束行"
          :error="form.errors.fend"
        >
          <el-input-number v-model="form.fields.fend"></el-input-number>
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

    <el-dialog
      class="header-base"
      :title="detailtitle"
      top="5%"
      width="80%"
      :visible="detailform.visible"
      :close-on-click-modal="false"
      @close="closemx"
    >
      <el-form
        :model="detailform.fields"
        label-width="120px"
        :rules="detailform.rules"
        ref="detailform"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="forder"
              size="small"
              class="mt"
              label="序号"
              :error="detailform.errors.forder"
            >
              <el-input-number
                size="small"
                v-model="detailform.fields.forder"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              prop="fcell"
              class="mt"
              label="Excel单元格列"
              :error="detailform.errors.fcell"
            >
              <el-input
                v-model="detailform.fields.fcell"
                placeholder="Excel单元格列"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="fcol"
              class="mt"
              label="模型列"
              :error="detailform.errors.fcol"
            >
              <el-input
                v-model="detailform.fields.fcol"
                placeholder="模型列"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="fcolmc"
              class="mt"
              label="模型列名称"
              :error="detailform.errors.fcolmc"
            >
              <el-input
                v-model="detailform.fields.fcolmc"
                placeholder="模型列名称"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="fdomain"
              class="mt"
              label="模型类"
              :error="detailform.errors.fdomain"
            >
              <el-input
                v-model="detailform.fields.fdomain"
                placeholder="模型类"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="ftype"
              class="mt"
              label="类型"
              :error="detailform.errors.ftype"
            >
              <el-input
                v-model="detailform.fields.ftype"
                placeholder="类型"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="fdefault"
              class="mt"
              label="默认值"
              :error="detailform.errors.fdefault"
            >
              <el-input
                v-model="detailform.fields.fdefault"
                placeholder="默认值"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="ffunc"
              class="mt"
              label="函数"
              :error="detailform.errors.ffunc"
            >
              <el-input
                v-model="detailform.fields.ffunc"
                placeholder="函数"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="pivot"
              class="mt"
              label="显示方式"
              :error="detailform.errors.fshow"
            >
              <el-radio-group v-model="detailform.fields.fshow">
                <el-radio label="x">行上</el-radio>
                <el-radio label="y">列上</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              prop="fnote"
              class="mt mb"
              label="备注"
              :error="detailform.errors.fnote"
            >
              <el-input
                v-model="detailform.fields.fnote"
                type="textarea"
                placeholder="备注"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              prop="fdisplay"
              class="mt"
              label="显示列"
              :error="detailform.errors.fdisplay"
            >
              <el-transfer
                style="text-align: left; display: inline-block;"
                v-if="detailform.fields.ftype === 'dic'"
                v-model="transfer"
                @change="onChangeTransfer"
                :data="transferList"
              ></el-transfer>
              <el-input
                type="textarea"
                readonly
                :rows="5"
                v-model="detailform.fields.fdisplay"
                placeholder="显示列"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="fqy"
              class="mt"
              label="启用否"
              :error="detailform.errors.fqy"
            >
              <el-checkbox
                v-model="detailform.fields.fqy"
                placeholder="启用否"
              ></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="closemx" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleDetailSubmit"
          :loading="detailform.loading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
  listbase,
  savebase,
  deletebase,
  updatebase,
  deletebasemx,
  savebasemx,
  baseinit,
  basevue
} from '../../api/develope/domain'
import serversort from '../../mix/serversort'
import table from '../../mix/table'
import types from '../../mix/types'
import query from '../../mix/query'
import check from '../../mix/check'
import _ from 'lodash'
export default {
  name: 'dics',
  mixins: [table, types, serversort, query, check],

  data () {
    return {
      transfer: [],
      transferList: [], // transfer 相关数据
      model: {
        visible: false,
        text: ''
      },
      btnInit: false,
      title: '',
      detailtitle: '',
      tableAutoHeight: null,
      showLoading: false,
      query: {
        name: 'base',
        ftype: '01',
        cols: [{ val: '', type: '%', col: 'fdomain' }],
        sort: 'fdomain',
        order: 'asc'
      },
      pivot: false,
      pivotType: ['求和', '数量', '平均值', '最小值', '最大值'],
      tabHeight: 100,
      sels: [], // 列表选中列
      rows: [],
      detailrows: [],
      fqy: true,
      total: 0,
      max: 20,
      offset: 0,
      currentPage: 0,
      form: {
        row: [],
        url: savebase,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          fdomain: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          fsheet: [
            { required: true, message: 'Sheet不能为空', trigger: 'blur' }
          ],
          fsum: [
            { required: false, message: 'Sheet不能为空', trigger: 'blur' }
          ],
          fsumcol: [
            { required: false, message: 'Sheet不能为空', trigger: 'blur' }
          ],
          fstart: [
            {
              required: true,
              type: 'number',
              message: '开始行不能为空',
              trigger: 'blur'
            }
          ],
          fend: [
            {
              required: true,
              type: 'number',
              message: '结束行不能为空',
              trigger: 'blur'
            }
          ],
          fdesc: [
            { required: true, message: 'fdesc不能为空', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: {
          fdomain: '',
          fsheet: '',
          fsum: '',
          fsumcol: '',
          fstart: '',
          fend: '',
          fdesc: ''
        }
      },
      detailform: {
        url: savebasemx,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          fcell: [{ required: true, message: 'Cell不能为空', trigger: 'blur' }],
          forder: [
            {
              required: true,
              type: 'number',
              message: '序号不能为空',
              trigger: 'blur'
            }
          ],
          fcol: [{ required: true, message: '模型不能为空', trigger: 'blur' }],
          fcolmc: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          ftype: [
            { required: false, message: '类型不能为空', trigger: 'blur' }
          ],
          fdefault: [
            { required: false, message: '默认值不能为空', trigger: 'blur' }
          ],
          ffunc: [
            { required: false, message: '函数不能为空', trigger: 'blur' }
          ],
          fnote: [
            { required: false, message: '备注不能为空', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: {
          fcell: '',
          fcol: '',
          fcolmc: '',
          ftype: '',
          fdefault: '',
          ffunc: '',
          fdisplay: '',
          fqy: true,
          fshow: '',
          fnote: ''
        }
      }
    }
  },
  mounted () {
    // this.reSize();
    this.initQuery()
    this.load()
  },
  methods: {
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const footerHeight = this.$refs['footer'].parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      this.tableAutoHeight = dynamicHeight
    },
    load () {
      this.selrow = {}
      this.showLoading = true
      let criteria = _.assign({}, { ftype: this.query.ftype })
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

      listbase(params)
        .then((response) => {
          if (response.code === -100) {
            this.$message.error(response.data.msg)
            this.listLoading = false
            return
          }
          this.rows = response.rows
          this.total = response.total
          this.max = response.max
          this.detailrows = []
          this.showLoading = false
          this.saveQuery()
        })
        .finally(() => {
          this.showLoading = false
        })
        .finally(() => {
          this.$nextTick(() => {
            this.setTableHeight()
          })
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
    filterFqy (value, row) {
      return row.fqy === value
    },

    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true
          let params = { id: row.id }
          deletebase(params)
            .then((response) => {
              if (response.data.code === -100) {
                this.$message.error(response.data.msg)
                this.showLoading = false
                return
              }
              this.showLoading = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.load()
            })
            .catch((error) => {
              this.showLoading = false
              this.$message.error(error)
            })
        })
        .catch(() => {
          this.$message('取消操作')
        })
    },
    // 删除明细
    handleDelmx: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true
          deletebasemx(row.id)
            .then((response) => {
              const { code, msg } = response
              if (code === -100) {
                this.$notify({
                  type: 'error',
                  message: msg
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
            .catch((error) => {
              this.showLoading = false
              this.$message.error(error)
            })
        })
        .catch(() => {
          this.$message('取消操作')
        })
    },
    // 批量删除
    batchDel: function () {
      // let ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(
        () => {
          this.showLoading = true
          // let params = { ids: ids }
          // deleteAllbase(params).then((response) => {
          //     if (response.data.code === -100) {
          //         this.$message.error(response.data.msg);
          //         this.showLoading = false;
          //         return;
          //     }
          //     this.showLoading = false;
          //     this.$message({
          //         message: '删除成功',
          //         type: 'success'
          //     });
          //     this.load();
          // }).catch((error) => {
          //     this.$message.error(error);
          //     this.showLoading = false;
          // })
        },
        () => {
          this.$message('取消操作')
        }
      )
    },
    operate: function (type, data) {
      this.form.visible = true
      this.form.row = Object.assign({}, data)
      if (type === 'edit') {
        this.title = '编辑'
        this.form.fields = data
        this.form.url = updatebase
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = savebase
      }
    },
    // 编辑明细数据
    operatemx: function (type, data) {
      this.detailform.visible = true
      if (type === 'edit') {
        this.detailtitle = '编辑'
        this.detailform.fields = data
        this.detailform.url = savebasemx
        // 如果是字典，加载加载相关数据
        const { ftype, fdisplay, fdomain } = data
        if (ftype === 'dic') {
          if (fdisplay !== '') {
            try {
              const v = JSON.parse(fdisplay)
              this.transfer = Object.keys(v)
            } catch (e) {}
          }
          // 这里不能用列 fcol ，因为可能有同一个字典用在多个列上
          basevue(fdomain, this.query.ftype, {
            label: 'fcolmc',
            key: 'fcol'
          }).then((response) => {
            this.transferList = response
          })
        }
      }
    },
    close: function () {
      this.form.visible = false
      this.form.loading = false
    },
    closemx: function () {
      this.detailform.visible = false
      this.detailform.loading = false
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
              let params = Object.assign({}, this.form.fields)
              this.form
                .url(params)
                .then((response) => {
                  const { code, msg } = response
                  if (code === -100) {
                    this.form.loading = false
                    this.$$notify({
                      type: 'error',
                      message: msg
                    })
                    let errors = response.data.errors.errors
                    errors.forEach((error) => {
                      this.form.errors[error.field] = error.message
                    })
                    return
                  }
                  this.form.loading = false
                  this.$notify({
                    message: msg,
                    type: 'success'
                  })
                  this.form.visible = false
                  this.reset()
                  this.load()
                })
                .catch((error) => {
                  this.$notify({
                    type: 'error',
                    message: error
                  })
                  this.form.loading = false
                })
            },
            () => {
              this.$message('操作取消')
            }
          )
        }
      })
    },
    handleDetailSubmit: function () {
      this.$refs['detailform'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(
            () => {
              this.detailform.loading = true
              let params = Object.assign({}, this.detailform.fields)
              this.detailform
                .url(params)
                .then((response) => {
                  let message = '提交成功'
                  if (response.data.code === -100) {
                    this.detailform.loading = false
                    message = response.data.msg
                    this.$message.error(response.data.msg)
                    let errors = response.data.errors.errors
                    errors.forEach((error) => {
                      this.detailform.errors[error.field] = error.message
                    })
                    return
                  }
                  this.detailform.loading = false
                  this.$notify({
                    message: message,
                    type: 'success'
                  })
                  this.detailform.visible = false
                  this.reset()
                  // this.load();
                })
                .catch((error) => {
                  this.$message.error(error)
                  this.detailform.loading = false
                })
            },
            () => {
              this.$message('操作取消')
            }
          )
        }
      })
    },
    reset: function () {
      this.form.fields = {
        fdomain: '',
        fsheet: '',
        fstart: '',
        fend: '',
        fdesc: ''
      }
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = updatebase
      }
    },
    // 删除数据
    onDelete () {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    showDetail (row) {
      //                this.selected = [row.id];
      this.selrow = row
      this.detailrows = row.cols
    },
    changeType (type) {
      this.query.ftype = type
      this.load()
      this.detailrows = null
      if (type === '04') {
        this.pivot = true
      } else {
        this.pivot = false
      }
    },
    onInit () {
      this.btnInit = true
      baseinit()
        .then((res) => {
          this.$notify({
            type: 'success',
            message: res.msg
          })
          this.load()
        })
        .finally(() => {
          this.btnInit = false
        })
    },
    onChangeTransfer () {
      const seltransfer = {}
      const transfer = this.transfer
      this.transferList.forEach((item) => {
        if (_.indexOf(transfer, item.key) >= 0) {
          seltransfer[item.key] = item.label
        }
      })
      this.detailform.fields.fdisplay = JSON.stringify(seltransfer, null, '\t')
    },
    onDrop ({ list }) {
      list.forEach((v, idx) => {
        v.forder = idx + 1
      })
      debugger
      updatebase(this.selrow)
        .then((response) => {
          const { msg } = response
          this.$notify({
            type: 'success',
            message: msg
          })
        })
        .finally(() => {})
    },
    row ({ row, rowIndex }) {
      return 'handle'
    }
  }
}
</script>

<style>
/* @import "~@/assets/style/common.scss"; */
/* .header-base .el-input-number {
    line-height: 28px;
  } */
.footerBtnx {
  height: 28px;
}
.el-transfer__button {
  padding: 6px 9px;
}
</style>
