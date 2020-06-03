<template>
  <d2-container ref="container">
    <el-row class="tyyks-row">
      <el-col :span="24" v-if="showheader">
        <div class="grid-content bg-purple">
          <div class="grid-header">
            <el-form class="topHorizontal" :inline="true" ref="header">
              <div>
                <el-form-item v-for="(item, index) in query.cols" :key="index">
                  <el-input v-model="item.val" placeholder="查找" :clearable="true" @clear="load">
                    <el-select
                      v-model="item.col"
                      slot="prepend"
                      placeholder="请选择"
                      style="width:110px;"
                    >
                      <el-option label="账号" value="userzh"></el-option>
                      <el-option label="用户名" value="usermc"></el-option>
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
                <el-form-item>
                  <el-button type="primary" size="mini" @click="loadcx">查询</el-button>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" size="mini" @click="operate('add')">新增</el-button>
                <el-button type="primary" size="mini" :disabled="canOperate" @click="onEdit">编辑</el-button>
                <el-button type="primary" size="mini" :disabled="canOperate" @click="onDelete">删除</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="canOperate"
                  @click="addAddress"
                >增加地址</el-button>
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
              ></el-table-column>-->
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
                label="绑定手机号"
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
              <el-pagination layout="total,prev, pager, next" :total="total" style="float:right;"></el-pagination>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="grid-main">
            <el-tabs type="border-card" v-model="tabname">
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
                  <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
                  <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="name"
                    label="收件人姓名"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="tel"
                    label="收件人电话"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="province"
                    label="省份"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="city"
                    label="城市"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="110px"
                    sortable="custom"
                    prop="county"
                    label="区县"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="150px"
                    sortable="custom"
                    prop="addressDetail"
                    label="详细地址地址"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="90px"
                    sortable="custom"
                    prop="default"
                    label="默认地址"
                    :formatter="booleanFormatter"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    label="操作"
                    header-align="center"
                    align="center"
                    width="90"
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      <i class="el-icon-edit" size="mini" @click="operatead('edit',scope.row)"></i>
                      &nbsp;&nbsp;&nbsp;
                      <i
                        type="danger"
                        size="mini"
                        class="el-icon-delete"
                        @click="handleDelad('scope.$index',scope.row)"
                      ></i>
                    </template>
                  </el-table-column>
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
      <el-form :model="form.fields" label-width="100px" :rules="form.rules" ref="form">
        <!-- <el-form-item prop="fdwbh" label="单位编号" :error="form.errors.fdwbh">
          <el-input v-model="form.fields.fdwbh" placeholder="单位编号"></el-input>
        </el-form-item>-->
        <el-form-item prop="userzh" label="账号" :error="form.errors.userzh">
          <el-input v-model="form.fields.userzh" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="usermc" label="用户名" :error="form.errors.usermc">
          <el-input v-model="form.fields.usermc" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话" :error="form.errors.phone">
          <el-input v-model="form.fields.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :error="form.errors.password">
          <el-input v-model="form.fields.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="admin" label="管理员" :error="form.errors.admin">
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
      v-dialogDrag
      :title="title"
      :top="'5%'"
      :visible.sync="formad.visible"
      :close-on-click-modal="false"
      @close="closeDialog('formad')"
    >
      <el-form :model="formad.fields" label-width="100px" :rules="formad.rules" ref="formad">
        <!-- <el-form-item prop="user.usermc" label="用户" :error="form.errors.user">
          <el-input v-model="form.fields.user.usermc" placeholder="用户">
            <el-button slot="append" @click="onOpenDialog('user')">用户列表</el-button>
          </el-input>
        </el-form-item>-->
        <el-form-item prop="name" label="收件人姓名" :error="formad.errors.name">
          <el-input v-model="formad.fields.name" placeholder="收件人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="收件人电话" :error="formad.errors.tel">
          <el-input v-model="formad.fields.tel" placeholder="收件人电话"></el-input>
        </el-form-item>
        <el-form-item prop="province" label="省份" :error="formad.errors.province">
          <el-input v-model="formad.fields.province" placeholder="省份"></el-input>
        </el-form-item>
        <el-form-item prop="city" label="城市" :error="formad.errors.city">
          <el-input v-model="formad.fields.city" placeholder="城市"></el-input>
        </el-form-item>
        <el-form-item prop="county" label="区县" :error="formad.errors.county">
          <el-input v-model="formad.fields.county" placeholder="区县"></el-input>
        </el-form-item>
        <el-form-item prop="addressDetail" label="详细地址" :error="formad.errors.addressDetail">
          <el-input v-model="formad.fields.addressDetail" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item prop="default" label="默认地址" :error="formad.errors.default">
          <el-switch v-model="form.fields.default" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="closead" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleSubmitad"
          :loading="formad.loading"
        >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :title="title"
      :top="'5%'"
      :visible.sync="formcart.visible"
      :close-on-click-modal="false"
      @close="closeDialog('formcart')"
    >
      <el-form :model="formcart.fields" label-width="100px" :rules="formcart.rules" ref="formcart">
        <el-form-item prop="goodsId" label="商品ID" :error="formcart.errors.goodsId">
          <el-input v-model="formcart.fields.goodsId" placeholder="商品ID">
            <el-button slot="append" @click="onOpenDialog('book')">书籍列表</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="number" label="商品数量" :error="formcart.errors.number">
          <el-input v-model="formcart.fields.number" placeholder="商品数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="closecart" size="mini">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.native="handleSubmitcart"
          :loading="formcart.loading"
        >提交</el-button>
      </div>
    </el-dialog>
    <help-table-dic
      :params="bookparams"
      title="书籍列表"
      height="400"
      seltype="S"
      dicname="book"
      :dialog-show="bookvisible"
      @helpdata="selectBook"
      @close="onCloseDialog('book')"
    />
  </d2-container>
</template>

<script>
// import { fileAction, fileExport } from "../../api/base/file";
import serversort from "../../mix/serversort";
import types from "../../mix/types";
import table from "../../mix/table";
import query from "../../mix/query";
import importer from "../../mix/importer";
import check from "../../mix/check";
import _ from "lodash";
import {
  userlist,
  userdelete,
  userupdate,
  usersave,
  usershow
} from "../../api/mall/user.js";
import {
  addresslist,
  addressdelete,
  addressupdate,
  addresssave
} from "../../api/mall/address.js";
import {
  itemorderlist,
  itemorderdelete,
  itemorderupdate,
  itemordersave
} from "../../api/mall/cart.js";

export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      bookvisible: false,
      bookparams: {},
      addresslist: [],
      orderlist: [],
      tabname: "tabaddress",
      showheader: true,
      firstTableHeight: 100, // 第一个表格高度
      containerHeight: 400,
      childTableHeight: 100,
      childTempHeight: 100,
      autotableHeight: 100,
      downloadparams: {},
      btntitle: "",
      title: "",
      showLoading: false,
      query: {
        name: "user",
        cols: [{ val: "", type: "%" }],
        sort: "dateCreated",
        order: "asc"
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
            { required: true, message: "账号不能为空", trigger: "blur" },
            { type: "string", message: "账号必须为字符串", trigger: "blur" }
          ],
          usermc: [
            { required: true, message: "用户名不能为空", trigger: "blur" },
            { type: "string", message: "用户名必须为字符串", trigger: "blur" }
          ],
          phone: [
            { required: true, message: "电话不能为空", trigger: "blur" },
            { type: "string", message: "电话必须为字符串", trigger: "blur" }
          ],
          password: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { type: "string", message: "密码必须为字符串", trigger: "blur" }
          ]
        },
        errors: {},
        fields: {
          userzh: "",
          usermc: "",
          phone: "",
          password: "",
          admin: false
        }
      },
      formad: {
        url: addresssave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          // "user.usermc": [
          //   { required: true, message: "用户不能为空", trigger: "blur" },
          //   { type: "string", message: "用户必须为字符串", trigger: "blur" }
          // ],
          name: [
            { required: true, message: "收件人姓名不能为空", trigger: "blur" },
            {
              type: "string",
              message: "收件人姓名必须为字符串",
              trigger: "blur"
            }
          ],
          tel: [
            { required: true, message: "收件人电话不能为空", trigger: "blur" },
            {
              type: "string",
              message: "收件人电话必须为字符串",
              trigger: "blur"
            }
          ],
          province: [
            { required: true, message: "省份不能为空", trigger: "blur" },
            { type: "string", message: "省份必须为字符串", trigger: "blur" }
          ],
          city: [
            { required: true, message: "城市不能为空", trigger: "blur" },
            { type: "string", message: "城市必须为字符串", trigger: "blur" }
          ],
          county: [
            { required: true, message: "区县不能为空", trigger: "blur" },
            { type: "string", message: "区县必须为字符串", trigger: "blur" }
          ],
          addressDetail: [
            { required: true, message: "详细地址不能为空", trigger: "blur" },
            { type: "string", message: "详细地址必须为字符串", trigger: "blur" }
          ],
          default: [
            { required: true, message: "默认地址不能为空", trigger: "blur" }
            // { type: "string", message: "默认地址必须为字符串", trigger: "blur" }
          ]
        },
        errors: {},
        fields: {
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          default: false
        }
      },
      formcart: {
        url: itemordersave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          goodsId: [
            { required: true, message: "商品ID不能为空", trigger: "blur" }
            // { type: "string", message: "商品ID必须为字符串", trigger: "blur" }
          ],
          number: [
            { required: true, message: "商品数量不能为空", trigger: "blur" },
            {
              type: "string",
              message: "商品数量必须为字符串",
              trigger: "blur"
            }
          ]
        },
        errors: {},
        fields: {
          goodsId: "",
          number: ""
        }
      }
    };
  },
  // watch number 数据
  watch: {
    query: {
      handler(nv, ov) {
        this.load();
      },
      deep: true
    }
  },
  mounted() {
    this.initQuery();
    this.load();
    this.$nextTick(() => {
      this.setHeight();
    });
  },
  methods: {
    setTableHeight: function() {
      const containerHeight = this.$refs["container"].$el.clientHeight;
      const headerHeight = this.$refs["header"].$el.parentNode.offsetHeight;
      const footerHeight = this.$refs["footer"].parentNode.offsetHeight;
      const dynamicHeight = containerHeight - headerHeight - footerHeight - 54;
      this.autotableHeight = dynamicHeight;
      this.tableHeight = dynamicHeight;
      this.containerHeight = containerHeight;
      this.childTableHeight = dynamicHeight / 2;
      this.firstTableHeight = dynamicHeight / 2;
      this.childTempHeight = dynamicHeight / 2;
    },
    loadcx() {
      let that = this;
      that.rows = [];
      that.total = 0;
      this.query.cols.forEach(item => {
        if (item.col === "userzh") {
          userlist().then(res => {
            res.rows.forEach(items => {
              if (items.userzh === item.val) {
                that.rows.push(items);
                that.total += 1;
              }
            });
          });
        } else if (item.col === "usermc") {
          userlist().then(res => {
            res.rows.forEach(items => {
              if (items.usermc === item.val) {
                that.rows.push(items);
                that.total += 1;
              }
            });
          });
        } else {
          this.load();
        }
      });
    },
    load() {
      this.selrow = {};
      this.showLoading = true;
      this.addresslist = [];
      this.orderlist = [];
      let criteria = {};
      const serversort = {};
      serversort[this.query.sort] = this.query.order;
      this.query.cols.forEach(item => {
        if (item.col) {
          criteria[item.col] = item.type + item.val + item.type;
        }
      });

      let params = _.assign(
        {},
        { max: this.max, offset: this.offset },
        { sort: serversort },
        { criteria: criteria }
      );
      this.downloadparams = params;
      userlist(params)
        .then(response => {
          if (response.code === -100) {
            this.$notify({
              title: "提示",
              message: response.msg,
              type: "error"
            });
            this.showLoading = false;
            return;
          }
          this.rows = response.rows;
          this.total = response.total;
          this.max = response.max;
          this.showLoading = false;
        })
        .finally(() => {
          this.showLoading = false;
        });

      this.$nextTick(() => {
        this.setTableHeight();
      });
    },
    closeDialog: function(name) {
      this.$refs[name].clearValidate();

      //                this.$refs["addForm"].resetFields();
      //                this.selectBm = {};
    },
    // 多选调用方法
    selsChange: function(sels) {
      this.sels = sels;
    },
    // 分页操作方法
    handlePage(val) {
      this.max = val;
      this.offset = this.max * this.currentPage;
      this.load();
    },
    handleCurPage(val) {
      this.currentPage = val - 1;
      if (this.currentPage <= -1) {
        this.currentPage = 0;
      }
      this.offset = this.max * this.currentPage;
      this.load();
    },
    // 删除角色
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        cancelButtonClass: "el-button--mini",
        confirmButtonClass: "el-button--mini",
        type: "warning"
      })
        .then(() => {
          this.showLoading = true;
          let params = { id: row.id };
          userdelete(params)
            .then(response => {
              if (response.code === -100) {
                this.$notify({
                  title: "提示",
                  message: response.msg,
                  type: "error"
                });
                this.showLoading = false;
                return;
              }
              this.showLoading = false;
              this.$notify({
                message: "删除成功",
                type: "success"
              });
              this.load();
            })
            .catch(error => {
              this.showLoading = false;
              this.$notify({
                title: "提示",
                message: error,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            message: "取消操作",
            type: "info"
          });
        });
    },
    operate: function(type, data) {
      this.form.visible = true;
      if (type === "edit") {
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...data });
        this.form.url = userupdate;
      } else {
        this.title = "新增";
        this.reset();
        this.form.url = usersave;
      }
    },
    close: function() {
      this.form.visible = false;
      this.form.loading = false;
    },
    closead: function() {
      this.formad.visible = false;
      this.formad.loading = false;
    },
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {
            cancelButtonClass: "el-button--mini",
            confirmButtonClass: "el-button--mini"
          }).then(
            () => {
              this.form.loading = true;
              let params = _.assign({}, this.form.fields);
              this.form
                .url(params)
                .then(response => {
                  let message = "提交成功";
                  if (response.code === -100) {
                    this.form.loading = false;
                    message = response.msg;
                    this.$message.error(response.msg);
                    let errors = response.errors;
                    errors.forEach(error => {
                      this.form.errors[error.field] = error.message;
                    });
                    return;
                  }
                  this.form.loading = false;
                  // this.$message({
                  //     message: message,
                  //     type: "success"
                  // });
                  this.$notify({
                    title: "提示",
                    message: message,
                    type: "success"
                  });
                  this.form.visible = false;
                  this.reset();
                  this.load();
                })
                .catch(error => {
                  this.form.loading = false;
                  this.$notify({
                    title: "提示",
                    message: error,
                    type: "error"
                  });
                });
            },
            () => {
              this.$notify({
                title: "提示",
                message: "取消操作",
                type: "info"
              });
            }
          );
        }
      });
    },
    reset: function() {
      this.form.fields = {
        userzh: "",
        usermc: "",
        phone: "",
        password: "",
        admin: false
      };
    },
    handleSubmitad: function() {
      this.$refs["formad"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {
            cancelButtonClass: "el-button--mini",
            confirmButtonClass: "el-button--mini"
          }).then(
            () => {
              this.formad.loading = true;
              let params = {
                user: { id: this.selrow.id },
                ...this.formad.fields
              };
              this.formad
                .url(params)
                .then(response => {
                  let message = "提交成功";
                  if (response.code === -100) {
                    this.formad.loading = false;
                    message = response.msg;
                    this.$message.error(response.msg);
                    let errors = response.errors;
                    errors.forEach(error => {
                      this.formad.errors[error.field] = error.message;
                    });
                    return;
                  }
                  this.formad.loading = false;
                  // this.$message({
                  //     message: message,
                  //     type: "success"
                  // });
                  this.$notify({
                    title: "提示",
                    message: message,
                    type: "success"
                  });
                  this.formad.visible = false;
                  this.resetad();
                  this.load();
                })
                .catch(error => {
                  this.formad.loading = false;
                  this.$notify({
                    title: "提示",
                    message: error,
                    type: "error"
                  });
                });
            },
            () => {
              this.$notify({
                title: "提示",
                message: "取消操作",
                type: "info"
              });
            }
          );
        }
      });
    },
    resetad: function() {
      this.formad.fields = {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        default: false
      };
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true;
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...this.selrow });
        this.form.url = userupdate;
      }
    },
    // 删除数据
    onDelete() {
      if (this.doCheck()) {
        this.handleDel(1, this.selrow);
      }
    },
    // 表格数据行点击
    onRowClick(row, col, event) {
      this.selrow = row;
      this.loadAddre();
      this.loadOrder();
    },
    loadAddre() {
      this.addresslist = this.selrow.addresses;
    },
    loadOrder() {
      this.orderlist = this.selrow.itemOrderDtos;
    },
    addAddress() {
      this.title = "新增地址";
      this.formad.visible = true;
    },
    operatead: function(type, data) {
      this.formad.visible = true;
      if (type === "edit") {
        this.title = "编辑地址";
        this.formad.fields = _.assign({}, { ...data });
        this.formad.url = addressupdate;
      } else {
        this.title = "新增";
        this.resetad();
        this.formad.url = addresssave;
      }
    },
    // 删除角色
    handleDelad: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        cancelButtonClass: "el-button--mini",
        confirmButtonClass: "el-button--mini",
        type: "warning"
      })
        .then(() => {
          this.showLoading = true;
          let params = { id: row.id };
          addressdelete(params)
            .then(response => {
              if (response.code === -100) {
                this.$notify({
                  title: "提示",
                  message: response.msg,
                  type: "error"
                });
                this.showLoading = false;
                return;
              }
              this.showLoading = false;
              this.$notify({
                message: "删除成功",
                type: "success"
              });
              this.load();
            })
            .catch(error => {
              this.showLoading = false;
              this.$notify({
                title: "提示",
                message: error,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            message: "取消操作",
            type: "info"
          });
        });
    },
    addCart() {
      this.title = "新增地址";
      this.formcart.visible = true;
    },
    operatecart: function(type, data) {
      this.formcart.visible = true;
      if (type === "edit") {
        this.title = "编辑";
        this.formcart.fields = _.assign({}, { ...data });
        this.formcart.url = itemorderupdate;
      } else {
        this.title = "新增";
        this.reset();
        this.formcart.url = itemordersave;
      }
    },
    closecart: function() {
      this.formcart.visible = false;
      this.formcart.loading = false;
    },
    handleSubmitcart: function() {
      this.$refs["formcart"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {
            cancelButtonClass: "el-button--mini",
            confirmButtonClass: "el-button--mini"
          }).then(
            () => {
              this.formcart.loading = true;
              let params = {
                user: { id: this.selrow.id },
                ...this.formcart.fields
              };
              this.formcart
                .url(params)
                .then(response => {
                  let message = "提交成功";
                  if (response.code === -100) {
                    this.formcart.loading = false;
                    message = response.msg;
                    this.$message.error(response.msg);
                    let errors = response.errors;
                    errors.forEach(error => {
                      this.formcart.errors[error.field] = error.message;
                    });
                    return;
                  }
                  this.formcart.loading = false;
                  // this.$message({
                  //     message: message,
                  //     type: "success"
                  // });
                  this.$notify({
                    title: "提示",
                    message: message,
                    type: "success"
                  });
                  this.formcart.visible = false;
                  this.resetcart();
                  this.load();
                })
                .catch(error => {
                  this.formcart.loading = false;
                  this.$notify({
                    title: "提示",
                    message: error,
                    type: "error"
                  });
                });
            },
            () => {
              this.$notify({
                title: "提示",
                message: "取消操作",
                type: "info"
              });
            }
          );
        }
      });
    },
    resetcart: function() {
      this.formcart.fields = {
        goodsId: "",
        number: ""
      };
    },
    // 删除角色
    handleDelcart: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        cancelButtonClass: "el-button--mini",
        confirmButtonClass: "el-button--mini",
        type: "warning"
      })
        .then(() => {
          this.showLoading = true;
          let params = { id: row.id };
          itemorderdelete(params)
            .then(response => {
              if (response.code === -100) {
                this.$notify({
                  title: "提示",
                  message: response.msg,
                  type: "error"
                });
                this.showLoading = false;
                return;
              }
              this.showLoading = false;
              this.$notify({
                message: "删除成功",
                type: "success"
              });
              this.load();
            })
            .catch(error => {
              this.showLoading = false;
              this.$notify({
                title: "提示",
                message: error,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            message: "取消操作",
            type: "info"
          });
        });
    },
    onOpenDialog(type = "user") {
      this[`${type}visible`] = true;
    },
    selectBook(row, show) {
      this.bookvisible = show;
      if (row) {
        this.formcart.fields.goodsId = row.id;
      }
    },
    onCloseDialog(type = "user") {
      this[`${type}visible`] = false;
    }
  }
};
</script>

<style>
@import "~@/assets/style/common.scss";
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
