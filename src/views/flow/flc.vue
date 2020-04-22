<style>
@import "~@/assets/style/common.scss";
.el-form-item__error {
  top: 5px;
  right: 3px;
  text-align: right;
  height: 0px;
}

.el-tabs__header {
  margin: 0;
}
.paneLDiv {
  position: relative;
  height: 100%;
}
.paneLDiv .panelTable {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 30px;
  left: 0;
  right: 0;
}
.paneLDiv .footer {
  position: absolute;
  width: 100%;
  padding: 1px;
  left: 0;
  bottom: 0;
  border-top: 1px solid #cfd7e5;
}
.tabFooter {
  padding: 1px;
  border-top: 1px solid #cfd7e5;
}
.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-body
  .container-component
  .d2-container-full
  .d2-container-full__body {
  overflow: hidden;
}
.el-dialog__body .el-table__fixed .el-table__fixed-body-wrapper {
  top: 39px !important;
}
</style>

<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" :inline="true" :model="query" ref="header">
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
    <split-pane v-on:resize="onResize" :min-percent="30" :default-percent="40" split="vertical">
      <template slot="paneL">
        <div class="paneLDiv">
          <el-table
            ref="baseTable"
            :height="tableHeight"
            :data="rows"
            v-loading="showLoading"
            highlight-current-row
            stripe
            border
            @selection-change="selsChange"
            @row-click="onRowClick"
            @sort-change="onSortChange"
            @show-summary="false"
            :summary-method="getSumClient"
          >
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
            <el-table-column
              min-width="100px"
              sortable="custom"
              prop="id"
              label="流程编号"
              align="center"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              sortable="custom"
              prop="fmc"
              label="流程名称"
              align="center"
            ></el-table-column>
            <el-table-column
              min-width="90px"
              :formatter="flcfqyfformatter"
              sortable="custom"
              prop="fqyf"
              label="启用否"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="paneR" ref="paneRDiv">
        <split-pane split="horizontal" :min-percent="30" :default-percent="50">
          <template slot="paneL" ref="paneRTDiv">
            <div class="paneLDiv">
              <div class="panelTable">
                <elx-editable
                  ref="editable1"
                  :height="'100%'"
                  :data.sync="selrow.mxes"
                  :edit-config="{trigger: 'dblclick', mode: 'cell',showStatus:true}"
                  @selection-change="selsChanger"
                  @row-click="onRowClickr"
                  v-loading="showLoading"
                  highlight-current-row
                  stripe
                  border
                >
                  <elx-editable-column type="selection" width="55"></elx-editable-column>
                  <elx-editable-column type="index" label="序号" width="70" align="center"></elx-editable-column>
                  <elx-editable-column
                    min-width="100px"
                    sortable="custom"
                    prop="fxh"
                    label="级别编号"
                    :edit-render="{name: 'ElInput'}"
                    align="center"
                  ></elx-editable-column>
                  <elx-editable-column
                    min-width="100px"
                    sortable="custom"
                    prop="fmc"
                    label="级别名称"
                    :edit-render="{name: 'ElInput'}"
                    align="center"
                  ></elx-editable-column>
                  <elx-editable-column
                    min-width="90px"
                    sortable="custom"
                    prop="fqyf"
                    label="启用否"
                    :filters="[{ text: '启用', value: true }, { text: '不启用', value: false }]"
                    :filter-method="filterFqy"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.fqyf" disabled></el-checkbox>
                    </template>
                  </elx-editable-column>
                </elx-editable>
              </div>
              <div class="footer">
                <div style="float:right;margin-right:5px;">
                  <el-button
                    :disabled="lcjbCanOperate"
                    @click="$refs.editable1.insertAt(null,-1)"
                    size="mini"
                  >增加</el-button>
                  <el-button :disabled="lcjbCanOperate" @click="onDeletEditable1" size="mini">删除</el-button>
                  <el-button
                    :disabled="lcjbCanOperate"
                    type="primary"
                    size="mini"
                    @click.native="handleSubmitJb"
                    :loading="form.loading"
                  >保存</el-button>
                </div>
              </div>
            </div>
          </template>
          <template slot="paneR">
            <div class="paneLDiv">
              <el-tabs v-model="ryfjlist">
                <el-tab-pane label="流程人员" name="flcjbry">
                  <elx-editable
                    ref="editableRy"
                    :height="tabTableHeight"
                    :data.sync="selmxrow.ry"
                    :edit-config="{trigger: 'dblclick', mode: 'cell',showStatus:true}"
                    @selection-change="selsChangeRy"
                    @cell-click="handCellClickRy"
                    v-loading="showLoading"
                    highlight-current-row
                    stripe
                    border
                  >
                    <elx-editable-column type="selection" header-align="center" align="center"></elx-editable-column>
                    <elx-editable-column type="index" label="序号" width="70" align="center"></elx-editable-column>
                    <elx-editable-column
                      width="160px"
                      sortable="custom"
                      prop="username"
                      label="用户"
                      align="center"
                      :edit-render="{type: 'default',autofocus: true}"
                    >
                      <template v-slot:edit="scope">
                        <el-input
                          readonly
                          clearable
                          v-model="scope.row.name"
                          @input="$refs.editableRy.updateStatus(scope)"
                          size="mini"
                        >
                          <!-- <el-button
                            style="padding:10px 1px"
                            slot="prepend"
                            icon="el-icon-close"
                            @click="onClearRy(scope.$index, scope.row)"
                          ></el-button>-->
                          <el-button
                            style="padding:10px 1px"
                            slot="append"
                            icon="el-icon-search"
                            @click="onOpenDialog(scope.$index, scope.row)"
                          ></el-button>
                        </el-input>
                      </template>
                    </elx-editable-column>
                    <!-- <elx-editable-column
                      width="160px"
                      sortable="custom"
                      prop="username"
                      label="用户编号"
                      align="center"
                    ></elx-editable-column>-->
                    <elx-editable-column
                      prop="name"
                      label="名称"
                      show-overflow-tooltip
                      align="center"
                      sortable
                      width="160px"
                    ></elx-editable-column>

                    <elx-editable-column
                      min-width="110px"
                      sortable="custom"
                      prop="fqyf"
                      label="启用否"
                      :filters="[{ text: '启用', value: true }, { text: '不启用', value: false }]"
                      :filter-method="filterFqyry"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.fqyf" disabled></el-checkbox>
                      </template>
                    </elx-editable-column>
                    <elx-editable-column
                      min-width="100px"
                      sortable="custom"
                      prop="fnote"
                      label="备注"
                      show-overflow-tooltip
                      :edit-render="{name: 'ElInput'}"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="80px"
                      sortable="custom"
                      prop="fip"
                      label="IP"
                      align="center"
                      show-overflow-tooltip
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="140px"
                      sortable="custom"
                      prop="foperid"
                      label="编制人编号"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="140px"
                      sortable="custom"
                      prop="foperxm"
                      label="编制人姓名"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="135px"
                      sortable="custom"
                      prop="dateCreated"
                      label="创建日期"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="135px"
                      sortable="custom"
                      prop="lastUpdated"
                      label="更新日期"
                      align="center"
                    ></elx-editable-column>
                  </elx-editable>
                  <div class="tabFooter">
                    <div style="float:right;margin-right:5px;">
                      <el-button
                        :disabled="lcryCanOperate"
                        @click="$refs.editableRy.insertAt(null,-1)"
                        size="mini"
                      >增加</el-button>
                      <el-button
                        :disabled="lcryCanOperate"
                        @click="onDeletEditableRy"
                        size="mini"
                      >删除</el-button>
                      <el-button
                        :disabled="lcryCanOperate"
                        type="primary"
                        size="mini"
                        @click.native="handleSubmitRy"
                        :loading="form.loading"
                      >保存</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="流程条件" name="flcjbtj">
                  <elx-editable
                    ref="editableLc"
                    :data.sync="selmxrow.tj"
                    :height="tabTableHeight"
                    :edit-config="{trigger: 'dblclick', mode: 'cell',showStatus:true}"
                    @selection-change="selsChangeLc"
                    v-loading="showLoading"
                    highlight-current-row
                    stripe
                    border
                  >
                    <elx-editable-column type="selection" header-align="center" align="center"></elx-editable-column>
                    <elx-editable-column type="index" label="序号" width="70" align="center"></elx-editable-column>
                    <elx-editable-column
                      min-width="160px"
                      sortable="custom"
                      prop="ftj"
                      label="流程条件"
                      align="center"
                      :edit-render="{type: 'default',autofocus: true}"
                    >
                      <template v-slot:edit="scope">
                        <el-input
                          readonly
                          clearable
                          v-model="scope.row.ftj"
                          @input="$refs.editableRy.updateStatus(scope)"
                          size="mini"
                        >
                          <el-button
                            style="padding:10px 1px"
                            slot="prepend"
                            icon="el-icon-close"
                            @click="onClearTj(scope.$index, scope.row)"
                          ></el-button>
                          <el-button
                            style="padding:10px 1px"
                            slot="append"
                            icon="el-icon-search"
                            @click="onOpenLctjDialog(scope.$index, scope.row)"
                          ></el-button>
                        </el-input>
                      </template>
                    </elx-editable-column>
                    <elx-editable-column
                      min-width="110px"
                      sortable="custom"
                      prop="fqyf"
                      label="启用否"
                      :filters="[{ text: '启用', value: true }, { text: '不启用', value: false }]"
                      :filter-method="filterFqylc"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.fqyf" disabled></el-checkbox>
                      </template>
                    </elx-editable-column>
                    <elx-editable-column
                      min-width="100px"
                      sortable="custom"
                      prop="fnote"
                      label="备注"
                      show-overflow-tooltip
                      :edit-render="{name: 'ElInput'}"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="80px"
                      sortable="custom"
                      prop="fip"
                      label="IP"
                      show-overflow-tooltip
                      :edit-render="{name: 'ElInput'}"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="140px"
                      sortable="custom"
                      prop="foperid"
                      label="编制人编号"
                      :edit-render="{name: 'ElInput'}"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="140px"
                      sortable="custom"
                      prop="foperxm"
                      label="编制人姓名"
                      :edit-render="{name: 'ElInput'}"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="135px"
                      sortable="custom"
                      prop="dateCreated"
                      label="创建日期"
                      align="center"
                    ></elx-editable-column>
                    <elx-editable-column
                      min-width="135px"
                      sortable="custom"
                      prop="lastUpdated"
                      label="更新日期"
                      align="center"
                    ></elx-editable-column>
                  </elx-editable>
                  <div class="tabFooter">
                    <div style="float:right;margin-right:5px;">
                      <el-button
                        :disabled="lctjCanOperate"
                        @click="$refs.editableLc.insertAt(null,-1)"
                        size="mini"
                      >增加</el-button>
                      <el-button
                        :disabled="lctjCanOperate"
                        @click="onDeletEditableLc"
                        size="mini"
                      >删除</el-button>
                      <el-button
                        :disabled="lctjCanOperate"
                        type="primary"
                        size="mini"
                        @click.native="handleSubmitLc"
                        :loading="form.loading"
                      >保存</el-button>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
        </split-pane>
      </template>
    </split-pane>

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
      <el-form :model="form.fields" label-width="100px" :rules="form.rules" ref="form">
        <el-form-item prop="id" label="流程编号" :error="form.errors.id">
          <el-input v-model.trim="form.fields.id" :disabled="false" placeholder="流程编号"></el-input>
        </el-form-item>
        <el-form-item prop="fmc" label="流程名称" :error="form.errors.fmc">
          <el-input v-model.trim="form.fields.fmc" :disabled="false" placeholder="流程名称"></el-input>
        </el-form-item>
        <el-form-item prop="fqyf" label="启用否" :error="form.errors.fqyf">
          <el-switch v-model="form.fields.fqyf" active-text="是" :disabled="false" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item prop="fnote" label="备注" :error="form.errors.fnote">
          <el-input v-model.trim="form.fields.fnote" :disabled="false" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item prop="fip" label="IP" :error="form.errors.fip">
          <el-input v-model.trim="form.fields.fip" :disabled="true" placeholder="IP"></el-input>
        </el-form-item>
        <el-form-item prop="foperid" label="编制人编号" :error="form.errors.foperid">
          <el-input v-model.trim="form.fields.foperid" :disabled="true" placeholder="编制人编号"></el-input>
        </el-form-item>
        <el-form-item prop="foperxm" label="编制人姓名" :error="form.errors.foperxm">
          <el-input v-model.trim="form.fields.foperxm" :disabled="true" placeholder="编制人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="dateCreated" label="创建日期" :error="form.errors.dateCreated">
          <el-input v-model.trim="form.fields.dateCreated" :disabled="true" placeholder="创建日期"></el-input>
        </el-form-item>
        <el-form-item prop="lastUpdated" label="更新日期" :error="form.errors.lastUpdated">
          <el-input v-model.trim="form.fields.lastUpdated" :disabled="true" placeholder="更新日期"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="mxes" label="mxes" :error="form.errors.mxes">
          <el-input v-generator.trim="form.fields.mxes.fmc">
            <el-button slot="append" @click="onOpenDialog("mxes")">mxes</el-button>
          </el-input>
        </el-form-item>-->
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
    <help-tree-dic
      :params="userparams"
      title="用户"
      height="400"
      seltype
      dicname="user"
      :dialog-show="uservisible"
      @helpdata="selectuser"
      @close="onCloseDialog"
    ></help-tree-dic>
    <el-dialog
      v-dialogDrag
      :top="'15%'"
      :visible.sync="lctjvisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      title="流程条件"
      width="40%"
    >
      <el-row>
        <el-form
          :model="lctjform.fields"
          label-width="100px"
          :rules="lctjform.rules"
          ref="lctjform"
        >
          <el-form-item prop="bdzd" label="表单字段">
            <el-select
              @change="handlebdzdChange"
              v-model="lctjform.fields.bdzd"
              filterable
              placeholder="表单字段"
              style="width:100%"
            >
              <el-option
                v-for="item in bdzdOptions"
                :key="item.fcol"
                :label="item.fcolmc"
                :value="item.fcol"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="xx" label="选项">
            <el-select v-model="lctjform.fields.xx" placeholder="选项" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sz" label="数值">
            <el-input v-model.trim="lctjform.fields.sz" :disabled="false" placeholder="数值"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="padding-left: 100px;padding-top:10px;padding-bottom:10px;">
        <el-button @click.native="close" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleSubmitLctj"
          :loading="form.loading"
        >保存</el-button>
      </el-row>
      <el-row>
        <el-col>
          <!-- <div
            v-if="selmxrow.tj[curOptJctjIndex]"
            style="height:140px; padding-top:3px; border-top:1px solid #dcdcdc;"
          >-->
          <!-- <el-row v-for="(item,index) in selmxrow.tj[curOptJctjIndex].ftj">
              <el-col :span="2">
                <span>{{index+1}}.</span>
              </el-col>
              <el-col :span="10">
                <span>{{item.bdzd}}{{item.xx}}{{item.sz}}</span>
              </el-col>
              <el-col :span="6">
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="doDeleteLctj(index)"
                >删除</el-button>
              </el-col>
          </el-row>-->
          <!-- </div> -->
          <!-- <div v-else style="height:140px; border-top:1px solid #dcdcdc;"></div> -->
        </el-col>
      </el-row>
    </el-dialog>
  </d2-container>
</template>

<script>
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import query from '../../mix/query'
import importer from '../../mix/importer'
import sum from '../../mix/sum'
import check from '../../mix/check'
import _ from 'lodash'
import {
  flclist,
  flcdelete,
  flcdeleteAll,
  flcupdate,
  flcupdateLcjb,
  flcsave,
  flclistBase
} from '../../api/flow/flc.js'

// form 默认数值
const initValues = {
  id: '',
  fmc: '',
  fqyf: true,
  fnote: '',
  fip: '',
  foperid: '',
  foperxm: '',
  dateCreated: '',
  lastUpdated: '',
  mxes: []
}
export default {
  name: 'flc',
  mixins: [serversort, types, table, query, importer, check, sum],
  data () {
    return {
      title: '',
      showLoading: false,
      query: {
        name: 'flc',
        val: '',
        sort: 'dateCreated',
        order: 'asc'
      },
      mxesparams: {},
      mxesvisible: false,
      sels: [], // 列表选中列
      selsry: [],
      selslc: [],
      rows: [],
      total: 0,
      max: 20,
      offset: 0,
      tabTableHeight: 100,
      currentPage: 0,
      ryfjlist: 'flcjbry',
      lcjbCanOperate: true,
      lcryCanOperate: true,
      lctjCanOperate: true,
      userparams: {},
      uservisible: false,
      curOptUserIndex: 0,
      lctjvisible: false,
      curOptJctjIndex: 0,
      bdzdOptions: [],
      qyList: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      options: [
        {
          value: '<',
          label: '小于'
        },
        {
          value: '<=',
          label: '小于等于'
        },
        {
          value: '=',
          label: '等于'
        },
        {
          value: '>',
          label: '大于'
        },
        {
          value: '>=',
          label: '大于等于'
        }
      ],
      lctjform: {
        rules: {
          bdzd: [
            {
              required: true,
              message: '表单字段不能为空',
              trigger: 'blur'
            }
          ],
          xx: [
            {
              required: true,
              message: '选项不能为空',
              trigger: 'blur'
            }
          ],
          sz: [
            {
              required: true,
              message: '数值不能为空',
              trigger: 'blur'
            },
            {
              type: 'number',
              message: '数值必须为数字',
              trigger: 'blur',
              transform (value) {
                return _.toNumber(value)
              }
            }
          ]
        },
        fields: {
          bdzd: '',
          bdzdmc: '',
          xx: '',
          sz: ''
        }
      },
      form: {
        url: flcsave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          id: [
            {
              required: true,
              message: '流程编号不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              message: '流程编号必须为字符串',
              trigger: 'blur'
            }
          ],
          fmc: [
            {
              required: true,
              message: '流程名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              message: '流程名称必须为字符串',
              trigger: 'blur'
            }
          ],
          fqyf: [
            {
              required: true,
              message: '启用否不能为空',
              trigger: 'blur'
            },
            {
              type: 'boolean',
              message: '启用否必须为条件',
              trigger: 'blur'
            }
          ]
        },
        errors: {},
        fields: initValues
      }
    }
  },
  // watch number 数据
  watch: {},
  mounted () {
    this.$nextTick(() => {
      this.setHeight()
    })
    window.onresize = () => {
      return (() => {
        this.tableHeight =
          this.$refs['container'].$el.clientHeight -
          this.$refs['header'].$el.clientHeight -
          35
      })()
    }
    this.load()
  },
  methods: {
    load () {
      this.showLoading = true
      let criteria = {}
      const serversort = {}
      const { val } = this.query
      serversort[this.query.sort] = this.query.order
      if (!_.isEmpty(val)) {
        ['col'].forEach(item => {
          criteria[item] = `%${val}%`
        })
      }
      let params = _.assign(
        {},
        {
          max: this.max,
          offset: this.offset
        },
        {
          sort: serversort
        },
        {
          criteria: {
            $or: criteria
          }
        }
      )
      flclist(params)
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
          if (response.rows.length > 0) {
            this.$refs.baseTable.setCurrentRow(response.rows[0])
            this.onRowClick(response.rows[0])
            this.lcjbCanOperate = false
          }
          this.total = response.total
          this.max = response.max
          this.showLoading = false
        })
        .finally(() => {
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
    selsChanger: function (sels) {
      this.selsr = sels
    },
    selsChangeRy: function (sels) {
      this.selsry = sels
    },
    selsChangeLc: function (sels) {
      this.selslc = sels
    },
    onDeletEditable1 () {
      if (this.selsr.length > 0) {
        this.$refs['editable1'].removeSelecteds()
      } else {
        this.$notify({
          title: '提示',
          message: '请选择要删除的信息！',
          type: 'error'
        })
      }
    },
    onDeletEditableRy () {
      if (this.selsry.length > 0) {
        this.$refs['editableRy'].removeSelecteds()
      } else {
        this.$notify({
          title: '提示',
          message: '请选择要删除的信息！',
          type: 'error'
        })
      }
    },
    onDeletEditableLc () {
      if (this.selslc.length > 0) {
        this.$refs['editableLc'].removeSelecteds()
      } else {
        this.$notify({
          title: '提示',
          message: '请选择要删除的信息！',
          type: 'error'
        })
      }
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
    handCellClickRy: function (row, column, cell, event) {},
    // 数据删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true
          let params = {
            id: row.id
          }
          flcdelete(params)
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
          let params = {
            ids: ids
          }
          flcdeleteAll(params)
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
        this.form.url = flcupdate
      } else {
        this.title = '新增'
        this.reset()
        this.form.url = flcsave
      }
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, this.selrow)
        this.form.url = flcupdate
      }
    },
    // 删除数据
    onDelete () {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow)
      }
    },
    close: function () {
      this.lctjvisible = false
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
    handleSubmitJb: function () {
      // const datastore = this.$refs['editable1'].getAllRecords()
      flcupdate(this.selrow)
        .then(response => {
          const { code } = response
          if (code === 100) {
            this.$notify({
              type: 'success',
              message: '保存成功！'
            })
          }
        })
        .finally(() => {})
    },
    // 人员保存
    handleSubmitRy: function () {
      // const datastore = this.$refs["editableRy"].getAllRecords();
      this.doSaveRyOrTj('editableRy')
    },
    // 条件保存
    handleSubmitLc: function () {
      // console.log(this.$refs["editableLc"].getAllRecords());
      this.doSaveRyOrTj('editableLc')
    },
    doSaveRyOrTj (table = 'editableRy') {
      // const datastore = this.$refs[table].getAllRecords();
      flcupdateLcjb(this.selmxrow)
        .then(response => {
          const { code } = response
          if (code === 100) {
            this.$notify({
              type: 'success',
              message: '保存成功！'
            })
          }
        })
        .finally(() => {})
    },
    onResize () {},
    reset: function () {
      this.form.fields = _.assign({}, initValues)
    },
    onOpenDialog (index, row) {
      this.curOptUserIndex = index
      this.uservisible = true
    },
    onClearTj (index, row) {
      this.rowstj[index].ftj = null
    },
    onClearRy (index, row) {
      this.selmxrow.ry[index].name = ''
      this.selmxrow.ry[index].username = ''
    },
    onOpenLctjDialog (index, row) {
      flclistBase(this.selrow.id)
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
          this.bdzdOptions = response.cols
        })
        .catch(error => {
          alert(error)
          this.showLoading = false
        })
      this.curOptJctjIndex = index
      this.lctjvisible = true
    },
    onCloseDialog (type = 'user') {
      // this[`${type}visible`] = false;
      this.uservisible = false
    },
    selectuser (row, show) {
      this.uservisible = show
      if (row) {
        this.selmxrow.ry[this.curOptUserIndex].name = row.name
        this.selmxrow.ry[this.curOptUserIndex].username = row.username
        this.$refs['editableRy'].refresh()
      }
    },
    handlebdzdChange (data) {},
    doDeleteLctj (index) {
      this.rowstj[this.curOptJctjIndex].ftj.splice(index, 1)
    },
    handleSubmitLctj () {
      this.$refs['lctjform'].validate(valid => {
        let _v = JSON.stringify(this.lctjform.fields)
        if (valid) {
          _v = {
            bdzd: this.lctjform.fields.bdzd,
            xx: this.lctjform.fields.xx,
            sz: this.lctjform.fields.sz
          }
          if (this.rowstj[this.curOptJctjIndex].ftj) {
            this.rowstj[this.curOptJctjIndex].ftj.push(_v)
          } else {
            this.rowstj[this.curOptJctjIndex].ftj = []
            this.rowstj[this.curOptJctjIndex].ftj.push(_v)
          }
          // alert(JSON.stringify(this.lctjform.fields))
          // this.$confirm("确认提交吗？", "提示", {}).then(
          //   () => {
          //
          //     // this.lctjvisible = false;
          //     // this.rowstj[this.curOptJctjIndex].ftj = this.lctjform.fields.bdzd + this.lctjform.fields.xx+this.lctjform.fields.sz
          //     // this.$refs["editableLc"].refresh()
          //   },
          //   () => {
          //     this.$notify({
          //       title: "提示",
          //       message: "取消操作",
          //       type: "info"
          //     });
          //   }
          // );
        }
      })
    },
    onRowClick (row, col, event) {
      this.selrow = row
      this.lcjbCanOperate = false
      this.lcryCanOperate = true
      this.lctjCanOperate = true
    },
    onRowClickr (row, col, event) {
      this.selmxrow = row
      this.lcryCanOperate = false
      this.lctjCanOperate = false
    },
    selectmxes (row, show) {
      this.mxesvisible = show
      if (row) {
        this.form.fields.mxes = {
          id: row.id,
          fmc: row.fmc
        }
      }
    },
    flcfqyfformatter (row, col, val) {
      return _.get(
        {
          true: '是',
          false: '否'
        },
        val,
        val
      )
    },
    flcjbfqyfformatter (row, col, val) {
      return _.get(
        {
          true: '是',
          false: '否'
        },
        val,
        val
      )
    },
    filterFqy (value, row) {
      return row.fqyf === value
    },
    filterFqyry (value, row) {
      return row.fqyf === value
    },
    filterFqylc (value, row) {
      return row.fqyf === value
    },
    flcjbtjfqyfformatter (row, col, val) {
      return _.get({ true: '是', false: '否' }, val, val)
    },
    flcjbryfqyfformatter (row, col, val) {
      return _.get({ true: '是', false: '否' }, val, val)
    },
    setHeight: function () {
      // alert(this.$refs['container'].$el.clientHeight);
      this.tabTableHeight =
        (this.$refs['container'].$el.clientHeight -
          this.$refs['header'].$el.clientHeight -
          34) /
          2 -
        70
      this.tableHeight =
        this.$refs['container'].$el.clientHeight -
        this.$refs['header'].$el.clientHeight -
        34
    }
  }
}
</script>
