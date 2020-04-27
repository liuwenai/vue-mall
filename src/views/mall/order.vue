<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" :inline="true" :model="query" ref="header">
        <div>
          <el-form-item v-for="(item,index) in query.cols" :key="index">
            <el-input v-model="item.val" placeholder="查找" :clearable="true" @clear="load">
              <el-select v-model="item.col" slot="prepend" placeholder="请选择" style="width:110px;">
                <el-option label="书名" value="title"></el-option>
                <el-option label="作者" value="author"></el-option>
                <el-option label="价格" value="price"></el-option>
                <el-option label="库存" value="kcsl"></el-option>
                <el-option label="邮费" value="express"></el-option>
                <el-option label="评价" value="fpj"></el-option>
              </el-select>
              <el-select v-model="item.type" slot="append" placeholder="请选择" style="width:70px;">
                <el-option label="模糊" value="%"></el-option>
                <el-option label="精确" value></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-for="(item,index) in query.cols.length - 1" :key="index">
            <el-button type="primary" size="mini" @click="removeQuery(index)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="load">查询</el-button>
            <el-button type="primary" size="mini" @click="groupQuery(16)">组合查询</el-button>
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
            :action="fileAction('morder','upload')"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" :loading="btntitle === '导入' " size="mini" icon="upload">导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" :loading="btntitle === '导出' " @click="onDownload">导出</el-button>
        </el-form-item> -->
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
      <el-table-column type="selection" header-align="center" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <!-- <el-table-column min-width="110px" sortable="custom" prop="fdwbh" label="单位编号" align="center"></el-table-column> -->
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
        min-width="110px"
        sortable="custom"
        prop="author"
        label="作者"
        show-overflow-tooltip
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        min-width="90px"
        sortable="custom"
        prop="price"
        label="价格"
        show-overflow-tooltip
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        min-width="140px"
        sortable="custom"
        prop="kcsl"
        label="库存"
        show-overflow-tooltip
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        min-width="140px"
        sortable="custom"
        prop="express"
        label="邮费"
        show-overflow-tooltip
        align="left"
        header-align="center"
      ></el-table-column>
      <el-table-column
        min-width="110px"
        sortable="custom"
        prop="fpj"
        label="评价"
        show-overflow-tooltip
        align="left"
        header-align="center"
      ></el-table-column>
      

      <!-- <el-table-column label="操作" header-align="center" align="center" width="145" fixed="right">
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
    <template slot="footer">
      <div ref="footer">
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
        <!-- <el-form-item prop="fdwbh" label="单位编号" :error="form.errors.fdwbh">
          <el-input v-model="form.fields.fdwbh" placeholder="单位编号"></el-input>
        </el-form-item>-->
        <el-form-item prop="title" label="书名" :error="form.errors.title">
          <el-input v-model="form.fields.title" placeholder="书名"></el-input>
        </el-form-item>
        <el-form-item prop="author" label="作者" :error="form.errors.author">
          <el-input v-model="form.fields.author" placeholder="作者"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="价格" :error="form.errors.price">
          <el-input v-model="form.fields.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item prop="fkc" label="库存" :error="form.errors.fkc">
          <el-input v-model="form.fields.fkc" placeholder="库存"></el-input>
        </el-form-item>
        <el-form-item prop="express" label="邮费" :error="form.errors.express">
          <el-input v-model="form.fields.express" disabled placeholder="邮费"></el-input>
        </el-form-item>
        <el-form-item prop="fpj" label="评价" :error="form.errors.fpj">
          <el-input v-model="form.fields.fpj" placeholder="评价"></el-input>
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
  mordersave,
} from "../../api/mall/order.js";


export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      downloadparams: {},
      btntitle: "",
      title: "",
      showLoading: false,
      query: {
        name: "morder",
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
          title: [
            { required: true, message: "书名不能为空", trigger: "blur" },
            { type: "string", message: "书名必须为字符串", trigger: "blur" }
          ],
          author: [
            { required: true, message: "作者不能为空", trigger: "blur" },
            { type: "string", message: "作者必须为字符串", trigger: "blur" }
          ],
          price: [
            { required: true, message: "价格不能为空", trigger: "blur" },
            { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: "价格格式有误",
              trigger: "blur" }
          ],
          kcsl: [
            { required: true, message: "库存不能为空", trigger: "blur" },
            { type: "string", message: "库存必须为字符串", trigger: "blur" }
          ],
          express: [
            { required: true, message: "邮费不能为空", trigger: "blur" },
            { type: "string", message: "邮费必须为字符串", trigger: "blur" }
          ],
          fpj: [
            { required: true, message: "评价不能为空", trigger: "blur" },
            { type: "string", message: "评价必须为字符串", trigger: "blur" }
          ],
        },
        errors: {},
        fields: {
          title: "",
          author: "",
          price: "",
          kcsl: "",
          express: 6,
          fpj: "",
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
        title: "",
        author: "",
        price: "",
        kcsl: "",
        express: 6,
        fpj: "",
      };
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true;
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...this.selrow });
        this.form.url = morderupdate;
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
    //   const url = fileAction("morder", "download");
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
