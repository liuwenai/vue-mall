<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" :inline="true" :model="query" ref="header">
        <div>
          <el-form-item v-for="(item,index) in query.cols" :key="index">
            <el-input v-model="item.val" placeholder="查找" :clearable="true" @clear="load">
              <el-select v-model="item.col" slot="prepend" placeholder="请选择" style="width:110px;">
                <el-option label="用户" value="user.usermc"></el-option>
                <el-option label="收件人姓名" value="name"></el-option>
              </el-select>
              <el-select v-model="item.type" slot="append" placeholder="请选择" style="width:70px;">
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
        </el-form-item>
        <!-- <el-form-item>
          <el-upload
            :headers="header"
            :show-file-list="false"
            :on-progress="onProgress"
            :action="fileAction('address','upload')"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" :loading="btntitle === '导入' " size="mini" icon="upload">导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" :loading="btntitle === '导出' " @click="onDownload">导出</el-button>
        </el-form-item>-->
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
      @sort-change="onSortChange"
      @row-click="onRowClick"
    >
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
        label="详细地址"
        show-overflow-tooltip
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        min-width="150px"
        sortable="custom"
        prop="code"
        label="地址编号"
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
    </el-table>
    <template slot="footer">
      <div ref="footer">
        <el-pagination layout="total,prev, pager, next" :total="total" style="float:right;"></el-pagination>
      </div>
    </template>
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
          <el-input v-model="form.fields.name" placeholder="收件人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="收件人电话" :error="form.errors.tel">
          <el-input v-model="form.fields.tel" placeholder="收件人电话"></el-input>
        </el-form-item>
        <el-form-item prop="province" label="省份" :error="form.errors.province">
          <el-input v-model="form.fields.province" placeholder="省份"></el-input>
        </el-form-item>
        <el-form-item prop="city" label="城市" :error="form.errors.city">
          <el-input v-model="form.fields.city" placeholder="城市"></el-input>
        </el-form-item>
        <el-form-item prop="county" label="区县" :error="form.errors.county">
          <el-input v-model="form.fields.county" placeholder="区县"></el-input>
        </el-form-item>
        <el-form-item prop="addressDetail" label="详细地址" :error="form.errors.addressDetail">
          <el-input v-model="form.fields.addressDetail" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item prop="default" label="默认地址" :error="form.errors.default">
          <el-input v-model="form.fields.default" placeholder="默认地址"></el-input>
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
  addresslist,
  addressdelete,
  addressupdate,
  addresssave
} from "../../api/mall/address.js";

export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      uservisible: false,
      userparams: {},
      downloadparams: {},
      btntitle: "",
      title: "",
      showLoading: false,
      query: {
        name: "address",
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
        url: addresssave,
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
            { required: true, message: "默认地址不能为空", trigger: "blur" },
            { type: "string", message: "默认地址必须为字符串", trigger: "blur" }
          ]
        },
        errors: {},
        fields: {
          user: { usermc: "" },
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          default: ""
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
    loadcx() {
      let that = this;
      that.rows = [];
      that.total = 0;
      this.query.cols.forEach(item => {
        if (item.col === "name") {
          addresslist().then(res => {
            res.rows.forEach(items => {
              if (items.name === item.val) {
                that.rows.push(items);
                that.total += 1;
              }
            });
          });
        } else if (item.col === "user.usermc") {
          addresslist().then(res => {
            res.rows.forEach(items => {
              if (items.user.usermc === item.val) {
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
      addresslist(params)
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
    operate: function(type, data) {
      this.form.visible = true;
      if (type === "edit") {
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...data });
        this.form.url = addressupdate;
      } else {
        this.title = "新增";
        this.reset();
        this.form.url = addresssave;
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
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        default: ""
      };
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true;
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...this.selrow });
        this.form.url = addressupdate;
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
    },
    // onDownload() {
    //   const url = fileAction("address", "download");
    //   this.btntitle = "导出";
    //   fileExport(url, this.downloadparams)
    //     .then(response => {
    //       // debugger
    //       const { code, msg, url } = response;
    //       if (code === 100) {
    //         window.open(url);
    //       } else {
    //         this.$notify({
    //           type: "error",
    //           message: msg,
    //           duration: 0
    //         });
    //       }
    //       // const blob = new Blob([response]);
    //       // const aEle = document.createElement("a"); // 创建a标签
    //       // const href = window.URL.createObjectURL(blob); // 创建下载的链接
    //       // aEle.href = href;
    //       // aEle.download = "资金到位.xlsx"; // 下载后文件名
    //       // document.body.appendChild(aEle);
    //       // aEle.click(); // 点击下载
    //       // document.body.removeChild(aEle); // 下载完成移除元素
    //       // window.URL.revokeObjectURL(href); // 释放掉blob对象
    //     })
    //     .finally(() => {
    //       this.btntitle = "";
    //     });
    // },
    // doBefore() {
    //   this.btntitle = "导入";
    // },
    // doLast() {
    //   this.load();
    //   this.btntitle = "";
    // }
    onOpenDialog(type = "user") {
      this[`${type}visible`] = true;
    },
    selectUser(row, show) {
      this.uservisible = show;
      if (row) {
        this.form.fields.user = {
          id: row.id,
          usermc: row.usermc
        };
      }
    },
    onCloseDialog(type = "user") {
      this[`${type}visible`] = false;
    }
  }
};
</script>

<style >
@import "~@/assets/style/common.scss";
/*.el-table .cell, .el-table th>div {*/
/*padding-left:5px;*/
/*padding-right:5px;*/
/*}*/
</style>
