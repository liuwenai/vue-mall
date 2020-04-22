<template>
  <d2-container ref="container">
    <split-pane
      :style="{'height':tableAutoHeightPX}"
      :min-percent="18"
      :default-percent="20"
      split="vertical"
    >
      <template slot="paneL">
        <div class="grid-content bg-purple">
          <div class="grid-header setHeight refreshTree" :style="{'height':tableAutoHeightTreePX}">
            <div class="refresh" @click="loadTree">
              <i class="el-icon-refresh"></i>
            </div>
            <div class="tree">
              <el-tree
                ref="treedataLeft"
                :data="treedataL"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
                @node-drag-end="handleDragEnd"
                :props="defaultPropsL"
                @node-click="onNodeClick"
              ></el-tree>
            </div>
          </div>
          <div class="checkBoxTree">
            <el-checkbox v-model="checked">包含下级</el-checkbox>
          </div>
        </div>
      </template>
      <template slot="paneR">
        <div :style="isshow?'':'display:flex'">
          <div :style="isshow?'width:100%':'width:55%'">
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
                          <el-option label="邮箱" value="email"></el-option>
                          <el-option label="用户编号" value="username"></el-option>
                          <el-option label="名称" value="name"></el-option>
                          <!-- <el-option label="图像" value="avatar"></el-option> -->
                          <!-- <el-option label="显示否" value="fxsf"></el-option> -->
                          <el-option label="备注" value="note"></el-option>
                          <!-- <el-option label="密码到期" value="passwordExpired"></el-option> -->
                          <!-- <el-option label="账号锁定" value="accountLocked"></el-option> -->
                          <!-- <el-option label="账号到期" value="accountExpired"></el-option> -->
                          <!-- <el-option label="启用否" value="enabled"></el-option> -->
                          <!-- <el-option label="管理员否" value="admin"></el-option> -->
                          <!-- <el-option label="用户名称" value="foperxm"></el-option> -->
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
                      <el-button v-show="isshow" type="primary" size="mini" @click="load">查询</el-button>
                      <el-button
                        v-show="isshow"
                        type="primary"
                        size="mini"
                        @click="groupQuery(12)"
                      >组合查询</el-button>
                    </el-form-item>
                  </div>
                  <el-form-item>
                    <el-button
                      v-show="isshow"
                      type="primary"
                      size="mini"
                      @click="operate('add',treeRow)"
                    >新增</el-button>
                    <el-button v-show="isshow" type="primary" size="mini" @click="showRole">展开授权</el-button>
                    <el-button v-show="!isshow" type="primary" size="mini" @click="showRole">隐藏赋权</el-button>
                    <el-button
                      v-show="isshow"
                      type="primary"
                      :disabled="canOperate"
                      size="mini"
                      @click="onEdit"
                    >编辑</el-button>
                    <el-button
                      v-show="isshow"
                      type="primary"
                      :disabled="canOperate"
                      size="mini"
                      @click="onDelete"
                    >删除</el-button>
                    <el-button v-show="isshow" type="primary" size="mini" @click="download">导出</el-button>
                  </el-form-item>
                  <el-form-item v-show="isshow">
                    <el-upload
                      :headers="header"
                      :show-file-list="showfile"
                      :on-progress="onProgress"
                      :action="fileAction('user','upload')"
                      :on-success="uploadSuccess"
                    >
                      <el-button type="primary" size="mini" icon="upload">导入</el-button>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div>
              <el-table
                ref="usertable"
                :height="tableAutoHeight"
                :data="rows"
                v-loading="showLoading"
                highlight-current-row
                border
                @sort-change="onSortChange"
                @row-click="onUserRowClick"
                @selection-change="selsUserChange"
              >
                <el-table-column type="selection" align="center" header-align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>

                <el-table-column
                  min-width="100px"
                  sortable="custom"
                  prop="username"
                  label="用户编号"
                  show-overflow-tooltip
                  header-align="center"
                  text-align="left"
                ></el-table-column>
                <el-table-column
                  min-width="90px"
                  sortable="custom"
                  prop="name"
                  label="名称"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="140px"
                  sortable="custom"
                  prop="bDepartment"
                  label="部门"
                  show-overflow-tooltip
                  align="left"
                  header-align="center"
                >
                  <template slot-scope="scope">{{scope.row.bDepartment.fmc}}</template>
                </el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="email"
                  label="邮箱"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="mobile"
                  label="手机号"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="fldapid"
                  label="AD域账号"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <!-- <el-table-column
                  min-width="90px"
                  sortable="custom"
                  prop="avatar"
                  label="图像"
                  align="center"
                >
                  <template slot-scope="scope">
                    <viewer :url="scopeAvatar(scope.row.avatar)" style="height: 60px;">
                      <img style="width: 60px; height: 60px" :src="scopeAvatar(scope.row.avatar)" />
                    </viewer>
                  </template>
                </el-table-column>-->
                <el-table-column
                  min-width="100px"
                  sortable="custom"
                  prop="admin"
                  :formatter="formmatfxsf"
                  label="管理员否"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="90px"
                  :formatter="formmatfxsf"
                  sortable="custom"
                  prop="fxsf"
                  label="显示否"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="100px"
                  sortable="custom"
                  :formatter="formmatfxsf"
                  prop="passwordExpired"
                  label="密码到期"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="100px"
                  sortable="custom"
                  :formatter="formmatfxsf"
                  prop="accountLocked"
                  label="账号锁定"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="100px"
                  sortable="custom"
                  :formatter="formmatfxsf"
                  prop="accountExpired"
                  label="账号到期"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="90px"
                  :formatter="formmatfxsf"
                  sortable="custom"
                  prop="enabled"
                  label="启用"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="90px"
                  sortable="custom"
                  prop="note"
                  label="备注"
                  show-overflow-tooltip
                  align="center"
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
                  min-width="120px"
                  sortable="custom"
                  prop="foperid"
                  label="用户编号"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="foperxm"
                  label="用户名称"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="dateCreated"
                  label="创建日期"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="120px"
                  sortable="custom"
                  prop="lastUpdated"
                  label="更新日期"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>

                <el-table-column label="改密码" align="center" width="80" fixed="right">
                  <template slot-scope="scope">
                    <i class="el-icon-thumb" @click="openRole(scope.row)"></i>
                    <!-- <el-button size="mini" class="mediabtn" @click="operate('edit',scope.row)">编辑</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      class="mediabtn"
                      @click="handleDel('scope.$index',scope.row)"
                    >删除</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
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
          </div>
          <div class="tabTree" v-show="!isshow" style="width: 45%">
            <el-tabs
              v-model="activeName"
              :style="{'width':'100%'}"
              type="border-card"
              @tab-click="handleClick"
            >
              <el-tab-pane label="功能权限" name="first">
                <div :style="isshow?'':'display:flex'">
                  <div v-show="!isshow" style="width: 50%">
                    <el-table
                      ref="roletable"
                      :height="tableAutoHeightR"
                      :data="rowsRole"
                      v-loading="showLoading"
                      highlight-current-row
                      border
                      @selection-change="selsRoleChange"
                      @row-click="onRoleRowClick"
                    >
                      <el-table-column type="selection" align="center" header-align="center"></el-table-column>
                      <el-table-column type="index" align="center" header-align="center"></el-table-column>
                      <el-table-column
                        min-width="100px"
                        sortable="custom"
                        prop="authority"
                        label="角色"
                        show-overflow-tooltip
                        align="left"
                      ></el-table-column>
                      <el-table-column
                        min-width="120px"
                        sortable="custom"
                        prop="fnote"
                        label="备注"
                        show-overflow-tooltip
                        align="left"
                      ></el-table-column>
                    </el-table>
                    <div class="checkboxBtn">
                      <el-button
                        type="primary"
                        size="mini"
                        :disabled="this.sels.length === 0"
                        @click="saveUsersRoles"
                      >授权</el-button>
                      <!-- <p>授权前请勾选用户列表数据</p> -->
                    </div>
                  </div>
                  <div v-show="!isshow" style="width: 50%">
                    <div class="grid-content bg-purple">
                      <div
                        class="grid-header setHeight"
                        :style="{'height':tableAutoHeightRTab+'px'}"
                      >
                        <el-tree
                          ref="tree"
                          :data="treedata"
                          highlight-current
                          :props="defaultProps"
                          :expand-on-click-node="false"
                          default-expand-all
                          show-checkbox
                          node-key="id"
                          :default-checked-keys="checkedTree"
                        ></el-tree>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="数据权限" name="second">
                <div :style="isshow?'':'display:flex'">
                  <div v-show="!isshow" style="width: 140">
                    <el-table
                      ref="datatable"
                      :height="tableAutoHeightR"
                      :data="dataRows"
                      v-loading="showLoading"
                      highlight-current-row
                      border
                      @row-click="onDataRowClick"
                    >
                      <el-table-column type="index" align="center" header-align="center"></el-table-column>
                      <el-table-column
                        min-width="100px"
                        sortable="custom"
                        prop="mc"
                        label="权限表"
                        show-overflow-tooltip
                        align="left"
                      ></el-table-column>
                    </el-table>
                    <div class="checkboxBtn">
                      <el-button
                        type="primary"
                        size="mini"
                        :disabled="!this.isAuthorization"
                        @click="saveUsersData"
                      >授权</el-button>
                    </div>
                  </div>
                  <div v-show="!isshow" style="width: 100%">
                    <div class="grid-content bg-purple">
                      <div
                        class="grid-header setHeight"
                        :style="{'height':tableAutoHeightRTab+'px'}"
                      >
                        <el-tree
                          v-show="this.permissiontype === 'tree'"
                          ref="permissiontree"
                          :data="permissiontreedata"
                          highlight-current
                          :props="defaultPropsL"
                          :expand-on-click-node="false"
                          default-expand-all
                          show-checkbox
                          node-key="id"
                          :default-checked-keys="checkedTreePer"
                          @check-change="onNodeClickR"
                        ></el-tree>
                        <el-table
                          v-show="this.permissiontype === 'table'"
                          ref="permissiondatatable"
                          :height="tableAutoHeightRTab"
                          :data="permissiondataRows"
                          highlight-current-row
                          border
                          @selection-change="onNodeClickR"
                        >
                          <el-table-column type="selection" align="center" header-align="center"></el-table-column>
                          <el-table-column type="index" align="center" header-align="center"></el-table-column>
                          <el-table-column
                            min-width="100px"
                            sortable="custom"
                            prop="id"
                            label="编号"
                            show-overflow-tooltip
                            align="left"
                          ></el-table-column>
                          <el-table-column
                            min-width="120px"
                            sortable="custom"
                            prop="mc"
                            label="名称"
                            show-overflow-tooltip
                            align="left"
                          ></el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
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
      <el-form :model="form.fields" label-width="120px" :rules="form.rules" ref="form">
        <el-form-item prop="username" class="mt" label="编号" :error="form.errors.username">
          <el-input v-model="form.fields.username" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item prop="name" class="mt" label="名称" :error="form.errors.name">
          <el-input v-model="form.fields.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item v-if="title === '新增'" prop="password" class="mt" label="密码" :error="form.errors.password">
          <el-input v-model="form.fields.password" show-password placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="email" class="mt" label="邮箱" :error="form.errors.email">
          <el-input v-model="form.fields.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" class="mt" label="手机号" :error="form.errors.mobile">
          <el-input v-model="form.fields.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="fldapid" class="mt" label="AD域账号" :error="form.errors.fldapid">
          <el-input v-model="form.fields.fldapid" placeholder="AD域账号"></el-input>
        </el-form-item>

        <el-form-item prop="fmc" class="mt" label="部门" :error="form.errors.fmc">
          <template>
            <el-tree-select
              style="width:200px;"
              v-model="form.fields.bDepartment.id"
              :selectParams="selectParams"
              :treeParams="treeParams"
              @searchFun="_searchFun"
              @node-click="_nodeClickFun"
              ref="treeSelect"
            />
          </template>
        </el-form-item>
        <!-- <el-form-item prop="avatar" class="mt" label="图像" :error="form.errors.avatar">
          <template>
            <el-upload
              class="avatar-uploader"
              :data="uploadMxdata"
              :action="userupload"
              :headers="header"
              :show-file-list="false"
              :on-success="uploadSuccess"
            >
              <img v-if="!isshowUpload" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </el-form-item>-->
        <el-form-item prop="note" class="mt" label="备注" :error="form.errors.note">
          <el-input v-model="form.fields.note" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item prop="fxsf" class="mt" label="显示否" :error="form.errors.fxsf">
          <el-switch v-model="form.fields.fxsf" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>

        <el-form-item
          prop="passwordExpired"
          class="mt"
          label="密码到期"
          :error="form.errors.passwordExpired"
        >
          <el-switch v-model="form.fields.passwordExpired" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item
          prop="accountLocked"
          class="mt"
          label="账号锁定"
          :error="form.errors.accountLocked"
        >
          <el-switch v-model="form.fields.accountLocked" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item
          prop="accountExpired"
          class="mt"
          label="账号到期"
          :error="form.errors.accountExpired"
        >
          <el-switch v-model="form.fields.accountExpired" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item prop="enabled" class="mt" label="启用否" :error="form.errors.enabled">
          <el-switch v-model="form.fields.enabled" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item prop="admin" class="mt mb" label="管理员否" :error="form.errors.admin">
          <el-switch v-model="form.fields.admin" active-text="是" inactive-text="否"></el-switch>
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
    <el-dialog
      :title="title"
      :top="'15%'"
      :visible.sync="psform.visible"
      :close-on-click-modal="false"
      @close="closeDialogPS"
    >
      <el-form
        label-width="120px"
        ref="psfrom"
        inline-message
        :rules="psform.rules"
        :model="psform.fields"
      >
        <el-form-item prop="username" class="mt" label="用户编号">
          <el-input disabled v-model="psform.fields.username" placeholder="用户编号"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="mt" label="密码">
          <el-input v-model="psform.fields.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2" class="mt mb" label="再次输入密码">
          <el-input v-model="psform.fields.password2" show-password placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="pshandleSubmit"
          :loading="psform.loading"
        >提交</el-button>
      </div>
    </el-dialog>

    <!-- <help-table-dic
      :params="params"
      title="角色字典"
      height="300"
      width="60%"
      seltype="S"
      dicname="role"
      :dialog-show="helpdicvisible"
      @helpdata="selectHelpDic"
    />-->
  </d2-container>
</template>
<script>
// import HelpTableDic from '../../components/z-helpdic/help-table-dic'
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import importer from '../../mix/importer'
import query from '../../mix/query'
import check from '../../mix/check'
import util from '@/libs/util.js'
import { fileAction } from '../../api/file'
import _ from 'lodash'
import { baseURL } from '@/plugin/axios'
import {
  userupdate,
  usersave,
  userlist,
  userrole,
  userrolelist,
  userrolessave,
  userrolesmenu,
  userdelete,
  userdeleteAll,
  usertree,
  userchangepwd,
  userdataall,
  userdatalist,
  userdatasave,
  userupload,
  userdownload
} from '../../api/admin/buser'
export default {
  name: 'user',
  // components: { HelpTableDic },
  mixins: [serversort, types, table, query, check, importer],
  data () {
    return {
      fileAction,
      activeName: 'first',
      selectParams: {
        multiple: false,
        clearable: true,
        placeholder: '请输入内容'
      },
      treeParams: {
        clickParent: false,
        filterable: false,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        'render-content': this._renderFun,
        data: [],
        props: {
          children: 'children',
          label: 'fmc',
          value: 'id'
        }
      },
      uploadMxdata: { id: -1 },
      isshowUpload: true,
      userupload: userupload,
      imgUrl:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      header: {},
      title: '',
      selectuser: {},
      selectPermissionData: {},
      permissiontype: '',
      isAuthorization: false,
      treeArr: [],
      permissiondataRows: [],
      permissionGrantRows: [],
      permissiontreedata: [],
      inittreeData: [],
      helpdicvisible: false,
      tableAutoHeight: null,
      tableAutoHeightR: null,
      tableAutoHeightPX: null,
      tableAutoHeightRTab: null,
      tableAutoHeightTreePX: null,
      treeRow: {},
      selectData: [],
      isshow: true,
      params: {},
      defaultPropsL: {
        children: 'children',
        label: 'fmc'
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showLoading: false,
      query: {
        name: 'user', // 查询保存的名称
        treemx: false, // 是否包含下级
        tree: {}, // 树点击选中查询条件
        cols: [{ val: '', type: '%' }], // 需要组合查询的列参数
        sort: 'dateCreated', // 默认排序列--通常是表格的第一列
        order: 'desc' // 默认排序方式
      },
      sels: [], // 列表选中列
      selRoles: [],
      rows: [],
      dataRows: [], // 数据权限列表
      rowsRole: [],
      total: 0,
      ids: [],
      first: true,
      treedataL: [],
      treedata: [],
      totalRole: [],
      checkedTree: [],
      checkedTreePer: [],
      checked: false,
      max: 20,
      offset: 0,
      psdata: [],
      currentPage: 0,
      form: {
        url: usersave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'string', message: '邮箱必须为字符串', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { type: 'string', message: '手机号必须为字符串', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { type: 'string', message: '名称必须为字符串', trigger: 'blur' }
          ],
          fxsf: [
            { required: true, message: '显示否不能为空', trigger: 'blur' },
            { type: 'boolean', message: '显示否必须为条件', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户编号不能为空', trigger: 'blur' },
            { type: 'string', message: '用户编号必须为字符串', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', message: '密码必须为字符串', trigger: 'blur' }
          ],
          accountExpired: [
            { required: true, message: '账号到期不能为空', trigger: 'blur' },
            { type: 'boolean', message: '账号到期必须为条件', trigger: 'blur' }
          ],
          accountLocked: [
            { required: true, message: '账号锁定不能为空', trigger: 'blur' },
            { type: 'boolean', message: '账号锁定必须为条件', trigger: 'blur' }
          ],
          passwordExpired: [
            { required: true, message: '密码到期不能为空', trigger: 'blur' },
            { type: 'boolean', message: '密码到期必须为条件', trigger: 'blur' }
          ],
          admin: [
            { required: true, message: 'admin不能为空', trigger: 'blur' },
            { type: 'boolean', message: 'admin必须为条件', trigger: 'blur' }
          ],
          enabled: [
            { required: true, message: '启用否不能为空', trigger: 'blur' },
            { type: 'boolean', message: '启用否必须为条件', trigger: 'blur' }
          ],
          foperid: [
            { required: true, message: '用户编号不能为空', trigger: 'blur' },
            { type: 'string', message: '用户编号必须为字符串', trigger: 'blur' }
          ],
          foperxm: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
            { type: 'string', message: '用户名称必须为字符串', trigger: 'blur' }
          ]
        },
        errors: {},
        fields: {
          bDepartment: {
            id: '',
            temp: ''
          },
          email: '',
          mobile: '',
          fldapid: '',
          name: '',
          avatar: '',
          fxsf: false,
          note: '',
          username: '',
          password: '',
          passwordExpired: false,
          accountLocked: false,
          accountExpired: false,
          enabled: true,
          admin: false,
          fip: '',
          foperid: '',
          foperxm: '',
          dateCreated: '',
          lastUpdated: ''
        }
      },
      psform: {
        url: userchangepwd,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          password: [
            { min: 8, message: '请输入不少于8个字符', trigger: 'blur' },
            { max: 16, message: '请输入不多于16个字符', trigger: 'blur' },
            {
              pattern: /^.*(?=.*[!@#$%^&*?\(\)]).*$/,
              message: '至少输入一个特殊字符'
            },
            { pattern: /^.*(?=.*\d).*$/, message: '至少输入一个数字' },
            { pattern: /^.*(?=.*[A-Z]).*$/, message: '至少输入一个大写字母' },
            { pattern: /^.*(?=.*[a-z]).*$/, message: '至少输入一个小写字母' }
          ],
          password2: [
            { min: 8, message: '请输入不少于8个字符', trigger: 'blur' },
            { max: 16, message: '请输入不多于16个字符', trigger: 'blur' },
            {
              pattern: /^.*(?=.*[!@#$%^&*?\(\)]).*$/,
              message: '至少输入一个特殊字符'
            },
            { pattern: /^.*(?=.*\d).*$/, message: '至少输入一个数字' },
            { pattern: /^.*(?=.*[A-Z]).*$/, message: '至少输入一个大写字母' },
            { pattern: /^.*(?=.*[a-z]).*$/, message: '至少输入一个小写字母' }
          ]
        },
        errors: {},
        fields: {
          username: '',
          password: '',
          password2: ''
        }
      }
    }
  },
  // watch number 数据
  watch: {},
  mounted () {
    // this.initQuery(); // 初始化条件
    this.load()
    // this.$nextTick(() => {
    //   this.setHeight();
    // });
    this.setTableHeight()
  },
  methods: {
    // 下拉框修改
    _selectChange (val) {
      // console.log(val, '<-select change');
    },
    // 树点击
    _nodeClickFun (data, node, vm) {
      // console.log('this _nodeClickFun', this.values, data, node);
      // this.form.fields.bDepartment.temp = data.id + ''
    },
    // 树过滤
    _searchFun (value) {
      // console.log(value, '<--_searchFun');
      this.$refs.treeSelect.filterFun(value)
    },
    // 自定义render
    _renderFun (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>
      )
    },
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const footerHeight = this.$refs['footer'].parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight - footerHeight
      const dynamicSmallHeight = containerHeight - headerHeight
      this.tableAutoHeight = dynamicHeight
      this.tableAutoHeightR = containerHeight - footerHeight - 40
      this.tableAutoHeightPX = containerHeight + 'px'
      this.tableAutoHeightRTab = containerHeight - 40
      this.tableAutoHeightTreePX = containerHeight - footerHeight + 'px'
      this.tableSmallHeight = dynamicSmallHeight
    },
    loadTree () {
      usertree().then(response => {
        this.treedataL = response
      })
    },
    onNodeClick (data) {
      this.treeRow = data
      if (this.query.treemx) {
        this.query.tree = { 'bDepartment.id': data.id }
      } else {
        this.query.tree = { 'bDepartment.id': `${data.id}%` }
      }
      this.first = false
      this.load()
    },
    scopeAvatar (avatar) {
      return avatar == null || avatar.indexOf('http') != -1
        ? avatar
        : `${baseURL}static/${avatar}`
    },
    load () {
      this.selrow = {}
      this.showLoading = true
      const token = util.cookies.get('token')
      this.header = { Authorization: `Bearer ${token}` }
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
        { max: this.max, offset: this.offset, tree: this.first },
        { sort: serversort },
        { criteria: criteria }
      )
      userlist(params)
        .then(response => {
          if (response.code === -100) {
            this.$message.error(response.msg)
            this.showLoading = false
            return
          }
          this.rows = response.rows
          // var arr = response.rows;
          // for(var i=0;i<arr.length;i++){
          //   arr[i].avatar=(arr[i].avatar==null || arr[i].avatar.indexOf('http')!=-1)?arr[i].avatar:`${baseURL}static/${arr[i].avatar}`
          // }
          // this.rows=arr;
          this.total = response.total
          if (response.tree) {
            this.treedataL = response.tree
            this.treeParams.data = response.tree
            // this.$refs.treeSelect.treeDataUpdateFun(response.tree);
            // var arr = JSON.parse(JSON.stringify(response.tree).replace(/fmc/g,"title"));
            // this.treeSelectData = arr;
            this.first = false
          }
          this.max = response.max
          this.showLoading = false
        })
        .finally(() => {
          this.showLoading = false
        })
      userrolelist({ cols: ['id', 'authority', 'fnote'] })
        .then(response => {
          if (response.code === -100) {
            this.$message.error(response.msg)
            this.showLoading = false
            return
          }
          this.rowsRole = response.rows
          this.totalRole = response.total
          if (response.tree) {
            this.treedata = response.tree
          }
          this.showLoading = false
        })
        .finally(() => {
          this.showLoading = false
        })
      // 数据权限列表
      userdataall().then(response => {
        this.dataRows = response
      })
      this.saveQuery() // 保存查询条件
    },
    closeDialogPS () {
      this.$refs['psfrom'].resetFields()
    },
    closeDialog () {
      this.$refs['form'].resetFields()
      //                this.$refs["addForm"].resetFields();
      //                this.selectBm = {};
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    // 角色行选中
    onRoleRowClick (row, column, event) {
      this.$refs.roletable.toggleRowSelection(row, true)
    },
    // 数据权限行选中,根据选择行的类型，来决定显示树形表格，还是普通表格
    onDataRowClick (row, column, event) {
      if (_.isEmpty(this.selectuser)) {
        this.$notify({
          message: '先选中一条用户数据',
          type: 'error'
        })
        return
      }
      this.permissiontype = row.comp
      this.selectPermissionData = row
      const p = { id: this.selectuser.id, type: row.type }
      userdatalist(p).then(response => {
        // 根据返回的数据进行处理
        if (response.type === 'tree') {
          this.permissiontreedata = response.allMenus
          this.checkedTreePer = response.grantMenus
          this.isAuthorization = response.grantMenus.length > 0
        }
        if (response.type === 'table') {
          this.permissiondataRows = response.dataList
          this.permissionGrantRows = response.grantData
          this.$nextTick(() => {
            const grants = this.permissionGrantRows
            this.permissiondataRows.forEach(item => {
              if (_.indexOf(grants, item.id) >= 0) {
                this.$refs.permissiondatatable.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    openRole (row) {
      this.psform.visible = true
      this.title = '修改 ' + row.name + ' 用户密码'
      this.psform.fields = _.assign({}, { ...row })
      this.psform.url = userchangepwd
      this.psform.fields.password = ''
    },
    // 多选调用方法
    selsUserChange: function (sels) {
      this.sels = sels
    },
    // 多选调用方法
    selsRoleChange: function (sels) {
      this.selRoles = sels
      const roleids = _.map(sels, 'id')
      userrolesmenu({ roles: roleids }).then(response => {
        if (response.code === -100) {
          this.$message.error(response.msg)
          // this.showLoading = false;
          return
        }
        this.treedata = response.allMenus
        this.checkedTree = response.grantMenus
        // this.selectRole = row;
      })
    },
    // 分页操作方法
    handlePage (val) {
      this.max = val
      this.offset = this.max * this.currentPage
      this.load()
    },
    showRole () {
      if (this.isshow) {
        this.isshow = false
      } else {
        this.isshow = true
      }
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
          userdelete(params)
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
          userdeleteAll(params)
            .then(response => {
              if (response.code === -100) {
                this.$message.error(response.msg)
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
      if (type === 'edit') {
        this.title = '编辑'
        this.uploadMxdata = { id: data.id }
        this.isshowUpload = false
        this.imgUrl =
          data.avatar == null || data.avatar.indexOf('http') !== -1
            ? data.avatar
            : `${baseURL}static/${data.avatar}`
        this.form.fields = _.assign(
          {},
          { ...data },
          { note: data.fnote },
          {
            bDepartment: {
              id: data.bDepartment.id
            }
          }
        )
        this.form.url = userupdate
        this.form.visible = true
      } else {
        if (_.isEmpty(this.treeRow)) {
          this.$notify({
            message: '请先在左侧树上选中一条数据',
            type: 'error'
          })
        } else {
          this.title = '新增'
          this.form.visible = true
          this.isshowUpload = true
          this.imgUrl = ''
          this.reset()
          this.form.fields = _.assign(
            {},
            { ...data },
            { bDepartment: { id: data.id, temp: data.id + '' } },
            {
              fxsf: false,
              passwordExpired: false,
              accountLocked: false,
              accountExpired: false,
              enabled: false,
              admin: false
            }
          )
          this.form.url = usersave
        }
      }
    },
    close: function () {
      this.form.visible = false
      this.form.loading = false
      this.psform.visible = false
      this.psform.loading = false
      this.$refs['form'].resetFields()
      this.$refs['psfrom'].resetFields()
    },
    pshandleSubmit: function () {
      if (this.psform.fields.password === this.psform.fields.password2) {
        this.$confirm(
          '确认修改' +
            this.psform.fields.name +
            ' 用户密码为' +
            this.psform.fields.password,
          '提示',
          {}
        ).then(
          () => {
            this.psform.loading = true
            let params = _.assign({}, this.psform.fields)
            this.psform
              .url(params)
              .then(response => {
                let message = '密码修改成功！'
                if (response.code === -100) {
                  this.psform.loading = false
                  message =
                    '修改密码失败！原因如下：' + response.msg.join('\r\n')
                  this.$message.error(message)
                  return
                }
                this.psform.loading = false
                // this.$message({
                //     message: message,
                //     type: "success"
                // });
                this.$notify({
                  title: '提示',
                  message: message,
                  type: 'success'
                })
                this.psform.visible = false
                this.reset()
                this.load()
              })
              .catch(error => {
                this.psform.loading = false
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
      } else {
        this.$notify({
          title: '提示',
          message: '两次输入的密码不一致',
          type: 'error'
        })
      }
    },
    uploadSuccess (response) {
      if (response.code === 100) {
        this.uploadMxdata = { id: -1 }
        this.imgUrl = `${baseURL}static/${response.data}`
        this.form.fields.avatar = `${baseURL}static/${response.data}`
        this.isshowUpload = false
        this.$notify({
          title: '提示',
          message: response.msg,
          type: 'success'
        })
      } else {
        this.$notify({
          title: '提示',
          message: response.msg,
          type: 'info'
        })
      }
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
                  const { code, msg, errors = {} } = response
                  if (code === -100) {
                    this.form.loading = false
                    this.form.errors = {}
                    this.$notify({
                      type: 'error',
                      message: msg
                    })
                    const formerrors = {}
                    errors.forEach(error => {
                      // this.$nextTick(() => {
                      formerrors[error.field] = _.get(
                        this.errorMsg,
                        error.message,
                        error.message
                      )
                      // });
                    })
                    this.$nextTick(() => {
                      this.form.errors = formerrors
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
                  this.first = true
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
        bDepartment: {
          id: '',
          temp: ''
        },
        email: '',
        mobile: '',
        fldapid: '',
        name: '',
        avatar: '',
        fxsf: false,
        note: '',
        username: '',
        password: '',
        passwordExpired: false,
        accountLocked: false,
        accountExpired: false,
        enabled: false,
        admin: false,
        fip: '',
        foperid: '',
        foperxm: '',
        dateCreated: '',
        lastUpdated: ''
      }
    },
    onNodeClickR (row, col, event) {
      if (row instanceof Array) {
        this.ids = _.map(row, 'id')
        this.isAuthorization = row.length > 0
      } else {
        var arr = this.$refs.permissiontree.getCheckedKeys()
        this.ids = arr
        this.isAuthorization = arr.length > 0
      }
    },
    saveUsersData () {
      let msg = ''
      if (this.sels.length >= 1) {
        msg = '给这' + this.sels.length + '个用户'
      } else {
        msg = '给' + ' ' + this.sels[0].username + ' '
      }
      this.$confirm(`确认要${msg}授权吗？`, '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(() => {
        const users = _.map(this.sels, 'id')
        const type = this.selectPermissionData.type
        // 暂时只做了单个处理
        const params = {
          users,
          type,
          ids: this.ids
        }
        userdatasave(params).then(res => {
          this.$notify({
            title: '提示',
            message: res.msg,
            type: 'success'
          })
        })
      })
    },
    saveUsersRoles () {
      let msg = ''
      if (this.sels.length >= 1) {
        msg = '给这' + this.sels.length + '个用户'
      } else {
        msg = '给' + ' ' + this.sels[0].username + ' '
      }
      this.$confirm(`确认要${msg}授权吗？`, '提示', {
        cancelButtonClass: 'el-button--mini',
        confirmButtonClass: 'el-button--mini',
        type: 'warning'
      }).then(() => {
        const users = _.map(this.sels, 'id')
        const roles = _.map(this.selRoles, 'id')
        // 暂时只做了单个处理
        const params = {
          users,
          roles
        }
        userrolessave(params).then(res => {
          this.$notify({
            title: '提示',
            message: res.msg,
            type: 'success'
          })
        })
      })
    },
    onUserRowClick (row, col, event) {
      // this.$refs.usertable.toggleRowSelection(row,true);
      this.selrow = row
      this.selectuser = row
      userrole(row.id).then(res => {
        if (res.code === 100) {
          this.$refs.roletable.clearSelection()
          res.rows.forEach(row => {
            this.rowsRole.forEach(role => {
              if (role.id === row.id) {
                this.$refs.roletable.toggleRowSelection(role, true)
              }
            })
          })
        }
      })
    },
    // 拖拽结束处理
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      // let parentid
      // if (dropType === 'inner') {
      //   parentid = dropNode.id
      // }
      // if (dropType === 'before' || dropType === 'after') {
      //   parentid = dropNode.parent.id
      // }
    },
    // 编辑数据
    onEdit () {
      if (this.doCheck()) {
        this.form.visible = true
        this.title = '编辑'
        this.form.fields = _.assign({}, { ...this.selrow })
        this.form.url = userupdate
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
      window.open(`${userdownload}?token=${token}`, '_blank')
    }
  }
}
</script>

<style scoped>
@import "~@/assets/style/common.scss";

.tree
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #409eff !important;
  color: #fff;
}
.tabTree .el-tabs--border-card > .el-tabs__content {
  padding: 0px !important;
}
/*  */
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
.el-table th > div {
  padding-left: 5px;
  padding-right: 5px;
}
.checkboxBtn {
  display: flex;
  align-items: center;
  justify-content: center;
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
.setHeight {
  overflow-y: scroll;
}
.checkBoxTree {
  display: flex;
  align-items: center;
  margin-left: 10px;
  height: 28px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
