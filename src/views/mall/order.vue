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
                      <el-option label="收件人姓名" value="name"></el-option>
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
              :height="firstTableHeight"
              :data="rows"
              v-loading="showLoading"
              highlight-current-row
              stripe
              border
              @selection-change="selsChange"
              @sort-change="onSortChange"
              @row-click="onRowClick"
            >
              <el-table-column type="selection" header-align="center" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
              <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
              <el-table-column
                min-width="130px"
                sortable="custom"
                prop="user.usermc"
                label="用户"
                show-overflow-tooltip
                align="center"
                header-align="center"
              ></el-table-column>
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
                label="详细地址"
                show-overflow-tooltip
                align="center"
                header-align="center"
              ></el-table-column>
              <el-table-column
                min-width="150px"
                sortable="custom"
                prop="address"
                label="地址"
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
                :formatter="formmatfddzt"
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
              <el-tab-pane label="购买书籍列表" name="tabbook">
                <el-table
                  :height="childTableHeight"
                  :data="books"
                  v-loading="showLoading"
                  highlight-current-row
                  stripe
                  border
                >
                  <!-- <el-table-column type="selection" header-align="center" align="center"></el-table-column> -->
                  <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
                  <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="id"
                    label="商品ID"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="title"
                    label="书名"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="price"
                    label="价格（元）"
                    show-overflow-tooltip
                    align="center"
                    header-align="center"
                  ></el-table-column>
                  <el-table-column
                    min-width="130px"
                    sortable="custom"
                    prop="gmsl"
                    label="购买数量"
                    show-overflow-tooltip
                    align="center"
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
      <el-form :model="form.fields" label-width="100px" :rules="form.rules" ref="form">
        <el-form-item prop="user.usermc" label="用户" :error="form.errors.user">
          <el-input v-model="form.fields.user.usermc" placeholder="用户">
            <el-button slot="append" @click="onOpenDialog('user')">用户列表</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="name" label="收件人姓名" :error="form.errors.name">
          <el-input v-model="form.fields.name" placeholder="订单人姓名">
            <!-- <el-button slot="append" @click="onOpenDialog('address')">地址列表</el-button> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="tel" label="收件人电话" :error="form.errors.tel">
          <el-input v-model="form.fields.tel" readonly placeholder="收件人电话"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="收件人地址" :error="form.errors.address">
          <el-select v-model="form.fields.address" @change="onChangeadd" placeholder="请选择">
            <el-option
              v-for="item in selectAddress"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="form.fields.address.addressDetail" readonly placeholder="订单地址"></el-input> -->
        </el-form-item>

        <el-form-item prop="fddbh" label="订单编号" :error="form.errors.fddbh">
          <el-input v-model="form.fields.fddbh" readonly placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item prop="fddsj" label="订单时间" :error="form.errors.fddsj">
          <el-date-picker
            readonly
            v-model="form.fields.fddsj"
            type="date"
            placeholder="订单时间"
            value-format="yyyyMMdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="fddje" label="订单金额" :error="form.errors.fddje">
          <el-input v-model="form.fields.fddje" placeholder="订单金额"></el-input>
        </el-form-item>
        <el-form-item prop="fddyf" label="订单邮费" :error="form.errors.fddyf">
          <el-input v-model="form.fields.fddyf" disabled placeholder="订单邮费"></el-input>
        </el-form-item>
        <el-form-item prop="fddzt" label="订单状态" :error="form.errors.fddzt">
          <el-select v-model="form.fields.fddzt" placeholder="订单状态" style="width:110px">
            <el-option v-for="(value, key) in fddztMap" :key="key" :label="value" :value="key"></el-option>
          </el-select>
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
    <help-table-dic
      :params="userparams"
      title="用户列表"
      height="400"
      seltype="S"
      dicname="user"
      :dialog-show="uservisible"
      @helpdata="selectUser"
      @close="onCloseDialog('user')"
    />
    <!-- <help-table-dic
      :params="addressparams"
      title="作者列表"
      height="400"
      seltype="S"
      dicname="address"
      :dialog-show="addressvisible"
      @helpdata="selectAddress"
      @close="onCloseDialog('address')"
    />-->
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
  morderlist,
  morderdelete,
  morderupdate,
  mordersave
} from "../../api/mall/order.js";
import { addressshow } from "../../api/mall/address.js";
import dayjs from "dayjs";
import { userlist } from "../../api/mall/user";
const today = new Date();
const todayStr = dayjs(today).format("YYYY-MM-DD");
const timeStr = dayjs(today).format("YYYYMMDDHHmmss");
export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      tabname: "tabbook",
      showheader: true,
      firstTableHeight: 100, // 第一个表格高度
      containerHeight: 400,
      childTableHeight: 100,
      childTempHeight: 100,
      autotableHeight: 100,
      selectAddress: [],
      selectedaddress: -1,
      uservisible: false,
      userparams: {},
      addressvisible: false,
      addressparams: {},
      downloadparams: {},
      btntitle: "",
      title: "",
      showLoading: false,
      query: {
        name: "morder",
        fddzt: "",
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
        url: mordersave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          "user.usermc": [
            { required: true, message: "用户不能为空", trigger: "blur" },
            { type: "string", message: "用户必须为字符串", trigger: "blur" }
          ],
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
          address: [
            { required: true, message: "收件人地址不能为空", trigger: "blur" }
            // {
            //   type: "string",
            //   message: "收件人地址必须为字符串",
            //   trigger: "blur"
            // }
          ],
          fddbh: [
            { required: true, message: "订单编号不能为空", trigger: "blur" },
            {
              type: "string",
              message: "订单编号必须为字符串",
              trigger: "blur"
            }
          ],
          fddsj: [
            { required: true, message: "订单时间不能为空", trigger: "blur" },
            {
              type: "string",
              message: "订单时间必须为字符串",
              trigger: "blur"
            }
          ],
          fddje: [
            { required: true, message: "订单金额不能为空", trigger: "blur" },
            {
              type: "number",
              message: "订单金额必须为数字",
              trigger: "blur"
            }
          ],
          fddzt: [
            { required: true, message: "订单状态不能为空", trigger: "blur" },
            {
              type: "string",
              message: "订单状态必须为字符串",
              trigger: "blur"
            }
          ],
          fddsl: [
            { required: true, message: "订单数量不能为空", trigger: "blur" },
            {
              type: "number",
              message: "订单数量必须为数字",
              trigger: "blur"
            }
          ]
        },
        errors: {},
        fields: {
          user: { usermc: "" },
          name: "",
          tel: "",
          address: "",
          fdddh: "",
          fddbh: timeStr,
          fddsj: todayStr,
          fddsl: 1,
          fddje: 0,
          fddzt: "",
          fddyf: 6
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
    // this.address()
    this.$nextTick(() => {
      this.setTableHeight();
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
        if (item.col === "name") {
          morderlist().then(res => {
            res.rows.forEach(items => {
              if (items.name === item.val) {
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
      morderlist(params)
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
          morderdelete(params)
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
        this.form.url = morderupdate;
      } else {
        this.title = "新增";
        this.reset();
        this.form.url = mordersave;
      }
    },
    close: function() {
      this.form.visible = false;
      this.form.loading = false;
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
              debugger;
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
        user: { usermc: "" },
        name: "",
        tel: "",
        address: "",
        fdddh: "",
        fddbh: timeStr,
        fddsj: todayStr,
        fddsl: 1,
        fddje: 0,
        fddzt: "",
        fddyf: 6
      };
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true;
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...this.selrow });
        this.form.url = morderupdate;
        this.address(this.selrow);
      }
    },
    address(data) {
      userlist().then(res => {
        const { rows } = res;
        rows.forEach(items => {
          debugger;
          if (data.user.usermc === items.usermc) {
            // const addresses = item.addresses;
            const selectAddress = [];
            items.addresses.forEach((item, index) => {
              // if (index === 0) {
              //   this.form.fields.name = item.name;
              //   this.form.fields.tel = item.tel;
              //   this.form.fields.id = item.id;
              //   this.form.fields.address = item.id;
              // }
              let sel = { value: item.id, label: item.addressDetail };
              selectAddress.push(sel);
            });
            this.selectAddress = selectAddress;
          }
        });
      });
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
      this.loadOrder();
    },
    loadOrder() {
      this.books = this.selrow.books;
    },
    onOpenDialog(type = "address") {
      this[`${type}visible`] = true;
    },
    selectUser(row, show) {
      this.uservisible = show;
      if (row) {
        this.form.fields.user = {
          id: row.id,
          usermc: row.usermc
        };
        const addresses = row.addresses;
        const selectAddress = [];
        addresses.forEach((item, index) => {
          if (index === 0) {
            this.form.fields.name = item.name;
            this.form.fields.tel = item.tel;
            this.form.fields.id = item.id;
            this.form.fields.address = item.id;
          }
          let sel = { value: item.id, label: item.addressDetail };
          selectAddress.push(sel);
        });
        this.selectAddress = selectAddress;
      }
    },
    onCloseDialog(type = "address") {
      this[`${type}visible`] = false;
    },
    onChangeyf(val) {
      if (val > 1) {
        this.form.fields.fddyf = 0;
      } else {
        this.form.fields.fddyf = 6;
      }
    },
    onChangeadd(value) {
      if (value) {
        debugger;
        addressshow({ id: value }).then(res => {
          const { row } = res;
          this.form.fields.name = row.name;
          this.form.fields.tel = row.tel;
          this.form.fields.address = row.addressDetail;
        });
      }
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
