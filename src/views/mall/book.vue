<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" :inline="true" :model="query" ref="header">
        <div>
          <el-form-item v-for="(item, index) in query.cols" :key="index">
            <el-input v-model="item.val" placeholder="查找" :clearable="true" @clear="load">
              <el-select v-model="item.col" slot="prepend" placeholder="请选择" style="width:110px;">
                <el-option label="书名" value="title"></el-option>
                <el-option label="作者" value="author"></el-option>
              </el-select>
              <el-select v-model="item.type" slot="append" placeholder="请选择" style="width:70px;">
                <el-option label="模糊" value="%"></el-option>
                <el-option label="精确" value></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-for="(item, index) in query.cols.length - 1" :key="index">
            <el-button type="primary" size="mini" @click="removeQuery(index)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="loadcx">查询</el-button>
            <!-- <el-button type="primary" size="mini" @click="groupQuery(16)">组合查询</el-button> -->
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" size="mini" @click="operate('add')">新增</el-button>
          <el-button type="primary" size="mini" :disabled="canOperate" @click="onEdit">编辑</el-button>
          <el-button type="primary" size="mini" :disabled="canOperate" @click="onDelete">删除</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-upload
            style="width:40px;"
            :show-file-list="false"
            :headers="header"
            :action="bookUpload('book','upload')"
            :on-progress="onProgress"
            :on-success="uploadSuccess"
          >
          <el-button type="primary" size="mini" :disabled="canOperate">增加图片</el-button>
          </el-upload>
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
        prop="author.name"
        label="作者"
        show-overflow-tooltip
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        min-width="130px"
        sortable="custom"
        prop="url"
        label="图片"
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
        <!-- <el-form-item prop="fdwbh" label="单位编号" :error="form.errors.fdwbh">
          <el-input v-model="form.fields.fdwbh" placeholder="单位编号"></el-input>
        </el-form-item>-->
        <el-form-item prop="title" label="书名" :error="form.errors.title">
          <el-input v-model="form.fields.title" placeholder="书名"></el-input>
        </el-form-item>
        <el-form-item prop="author.name" label="作者" :error="form.errors.author">
          <el-input v-model="form.fields.author.name" placeholder="作者">
            <el-button slot="append" @click="onOpenDialog('author')">作者列表</el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-if="title === '编辑'" prop="url" label="图片" :error="form.errors.url">
          <el-upload
            :data="uploadparams"
            :headers="header"
            :action="bookUpload('image')"
            list-type="picture-card"
            :on-progress="onProgress"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="price" label="价格" :error="form.errors.price">
          <el-input v-model="form.fields.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item prop="kcsl" label="库存" :error="form.errors.kcsl">
          <el-input v-model.number="form.fields.kcsl" placeholder="库存"></el-input>
        </el-form-item>
        <el-form-item prop="express" label="邮费" :error="form.errors.express">
          <el-input v-model="form.fields.express" disabled placeholder="邮费"></el-input>
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
      :params="authorparams"
      title="作者列表"
      height="400"
      seltype="S"
      dicname="author"
      :dialog-show="authorvisible"
      @helpdata="selectAuthor"
      @close="onCloseDialog('author')"
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
import util from "@/libs/util.js";
import {
  booklist,
  bookdelete,
  bookupdate,
  booksave,
  bookUpload
} from "../../api/mall/book.js";
export default {
  mixins: [serversort, types, table, query, importer, check],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      uploadparams: { id: "", fmc: "" }, // 上传参数
      title: "",
      authorvisible: false,
      authorparams: {},
      showLoading: false,
      query: {
        name: "book",
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
        url: booksave,
        loading: false,
        visible: false,
        edit: false,
        rules: {
          title: [
            { required: true, message: "书名不能为空", trigger: "blur" },
            { type: "string", message: "书名必须为字符串", trigger: "blur" }
          ],
          "author.name": [
            { required: true, message: "作者不能为空", trigger: "blur" },
            { type: "string", message: "作者必须为字符串", trigger: "blur" }
          ],
          price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
          kcsl: [
            { required: true, message: "库存不能为空", trigger: "blur" }
            // { type: 'string', message: '库存必须为字符串', trigger: 'blur' },
          ]
          // fpj: [
          //   { required: true, message: "评价不能为空", trigger: "blur" },
          //   { type: "string", message: "评价必须为字符串", trigger: "blur" }
          // ],
        },
        errors: {},
        fields: {
          title: "",
          author: { name: "" },
          url: "",
          price: "",
          kcsl: 0,
          express: 6,
          fpj: ""
        }
      }
    };
  },
  // watch number 数据
  watch: {
    // query: {
    //   handler(nv, ov) {
    //     this.load();
    //   },
    //   deep: true
    // }
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
        if (item.col === "title") {
          booklist().then(res => {
            res.rows.forEach(items => {
              if (items.title === item.val) {
                that.rows.push(items);
                that.total += 1;
              }
            });
          });
        } else if (item.col === "author") {
          booklist().then(res => {
            res.rows.forEach(items => {
              if (items.author.name === item.val) {
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
      // this.downloadparams = params
      booklist()
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
          debugger
          bookdelete(params)
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
        this.form.url = bookupdate;
      } else {
        this.title = "新增";
        this.reset();
        this.form.url = booksave;
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
        title: "",
        url: "",
        author: { name: "" },
        price: "",
        kcsl: 0,
        express: 6,
        fpj: ""
      };
    },
    // 编辑数据
    onEdit() {
      if (this.doCheck()) {
        this.form.visible = true;
        this.title = "编辑";
        this.form.fields = _.assign({}, { ...this.selrow });
        debugger
        this.form.url = bookupdate;
        const token = util.cookies.get("token");
        this.header = { Authorization: "Bearer " + token };
        this.uploadparams = {id: this.selrow.id }; // 设置附件上传额外参数
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
    onOpenDialog(type = "author") {
      this[`${type}visible`] = true;
    },
    selectAuthor(row, show) {
      this.authorvisible = show;
      if (row) {
        this.form.fields.author = {
          id: row.id,
          name: row.name
        };
      }
    },
    onCloseDialog(type = "author") {
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
