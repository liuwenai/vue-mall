<template>
  <d2-container ref="container">
    <div class="designBox">
      <div class="pageDesign">
        <div ref="designer" id="form-designer"></div>
      </div>
    </div>
    <!--  模型 dialog -->
    <el-dialog
      v-dialogDrag
      :title="'模型设置'"
      :top="'5%'"
      :width="'30%'"
      :modal="false"
      :visible.sync="formAttr.visible"
      :close-on-click-modal="false"
      @close="closeDialog"
      class="dialog"
    >
      <el-form :model="formAttr" :rules="formAttr.rules" ref="formAttr" inline-message>
        <el-table :data="formAttr.gridData" stripe border>
          <el-table-column property="name" label="说明"></el-table-column>
          <el-table-column property="data" label="数值">
            <template scope="scope">
              <el-form-item :prop="'gridData.' + scope.$index + '.data'">
                <el-select
                  v-if="scope.row.type=='selectTable'"
                  v-model="model"
                  placeholder="请选择"
                  @change="onChangeModel"
                >
                  <el-option
                    v-for="item in models"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select
                  v-else-if="scope.row.type=='selectType'"
                  v-model="scope.row.data"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in elselects"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input v-else size="small" v-model="scope.row.data"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click.native="onSure" :loading="formAttr.loading">确定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'
import { xsheetsave, xsheetupdate, xsheetshow } from '../../api/xsheet'
import types from '../../mix/types'
import report from '../../mix/report'
import _ from 'lodash'

const blankSheet = {
  styles: [
    {
      bgcolor: '#f4f5f8',
      textwrap: true,
      color: '#900b09',
      border: {
        top: ['thin', '#0366d6'],
        bottom: ['thin', '#0366d6'],
        right: ['thin', '#0366d6'],
        left: ['thin', '#0366d6']
      }
    }
  ],
  rows: {
    1: {
      cells: {
        0: { text: '11' },
        2: { text: '' }
      }
    }
  }
}
export default {
  name: 'form-designer',
  mixins: [types, report],
  data () {
    return {
      spreadsheet: null, //
      action: xsheetsave,
      sheetdata: {},
      visible: false,
      checked: false,
      formArr: {},
      id: '',
      formAttr: {
        visible: false,
        loading: false,
        rules: {},
        fields: {},
        gridData: [
          { name: '模型表', data: '', type: 'selectTable' },
          { name: '单元格', data: '', type: '' },
          { name: '文本', data: '', type: '' },
          { name: '数据类型', data: '', type: 'selectType' },
          { name: '默认值', data: '', type: '' },
          { name: '格式', data: '', type: '' }
        ]
      },
      query: {
        name: 'form-designer',
        colss: {}
      },
      // element ui 组件
      elselects: [
        { value: 'el-button', label: '按钮' },
        { value: 'el-input', label: '输入框' },
        { value: 'el-radio', label: '单选框' },
        { value: 'el-checkbox', label: '多选框' },
        { value: 'el-input-number', label: '计数器' },
        { value: 'el-select', label: '选择器' },
        { value: 'el-cascader', label: '级联选择器' },
        { value: 'el-switch', label: '开关' },
        { value: 'el-slider', label: '滑块' },
        { value: 'el-time-select', label: '时间选择器' },
        { value: 'el-date-picker', label: '日期选择器' },
        { value: 'el-upload', label: '上传' },
        { value: 'el-rate', label: '评分' },
        { value: 'el-transfer', label: '穿梭框' },
        { value: 'el-form', label: '表单' },
        { value: 'el-table', label: '表格' },
        { value: 'el-tag', label: '标签' },
        { value: 'el-progress', label: '进度条' },
        { value: 'el-pagination', label: '分页' },
        { value: 'el-badge', label: '标记' },
        { value: 'el-tree', label: '树形控件' },
        { value: 'el-alert', label: '警告' },
        { value: 'el-menu', label: '导航菜单' },
        { value: 'el-tabs', label: '标签页' },
        { value: 'el-breadcrumb', label: '面包屑' },
        { value: 'el-page-header', label: '页头' },
        { value: 'el-dropdown', label: '下拉菜单' },
        { value: 'el-steps', label: '步骤条' },
        { value: 'el-dialog', label: '对话框' },
        { value: 'el-tooltip', label: '文字提示' },
        { value: 'el-popover', label: '弹出框' },
        { value: 'el-card', label: '卡片' },
        { value: 'el-carousel', label: '走马灯' },
        { value: 'el-collapse', label: '折叠面板' },
        { value: 'el-timeline', label: '时间线' },
        { value: 'el-divider', label: '分割线' },
        { value: 'el-calendar', label: '日历' },
        { value: 'el-image', label: '图片' },
        { value: 'el-backtop', label: '回到顶部' }
      ],
      models: [
        {
          value: 'flc',
          label: '流程'
        },
        {
          value: 'wbjd',
          label: '外宾接待'
        },
        {
          value: 'cgjh',
          label: '出国计划'
        }
      ],
      model: 'flc'
    }
  },
  mounted () {
    this.designer = new Spreadsheet(this.$refs.designer, {
      events: {
        design: this.onOpenModel,
        form: this.onPreviewForm,
        preview: this.onPreview,
        cellclick: this.onCellclick,
        save: this.onSave
      },
      showContextmenu: true,
      showToolbar: true,
      showGrid: true,
      readOnly: false,
      row: {
        len: 21,
        height: 25
      },
      col: {
        len: 20,
        width: 100,
        indexWidth: 60,
        minWidth: 60
      }
    })
    setTimeout(() => {
      this.initXspreadSheet()
    }, 300)
  },
  methods: {
    async initXspreadSheet () {
      // 从后台加载格式
      const response = await xsheetshow(this.model)
      const { code, data } = response
      if (code === 100 && _.get(data, 'fgs', '') !== '') {
        this.action = xsheetupdate
        this.sheetdata = JSON.parse(data.fgs)
      } else {
        this.sheetdata = blankSheet
      }
      await this.$store.dispatch('d2admin/db/get', {
        dbName: 'xspreadsheet',
        path: 'admin.usersqb',
        defaultValue: ''
      })

      this.designer
        .loadData(this.sheetdata)

        // .dragCol((c, d) => {
        //   var obj = this.query.colss;
        //   obj[c.ci] = { width: d };
        //   this.query.colss = obj;
        //   this.saveReport();
        // })
        .change(
          _.debounce(data => {
            // 这是输出的是对应的格式，设计好后，那这个数据放到参数配置里
            // this.$store.dispatch("d2admin/db/set", {
            //   dbName: "xspreadsheet",
            //   path: "admin.usersqb",
            //   value: data
            // });
            // _.debounce(this.saveSheet(data),2000)
            this.saveSheet(data)
            console.log('表格格式数据')
            console.log(JSON.stringify(data))
            // this.query.colss= data.cols;
            // this.saveReport();
            // alert(JSON.stringify(data));
            // save data to db
          }, 1000)
        )
    },
    // 数据格式导入
    saveSheet (data) {
      const params = {
        id: this.model,
        fmc: '用户申请表',
        fgs: JSON.stringify(data)
      }
      this.action(params)
        .then(response => {
          const { code, msg = '数据保存成功！' } = response
          this.$notify({
            type: code === 100 ? 'success' : 'error',
            message: msg
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 模型数据变化
    onChangeModel (v) {
      debugger
      this.initXspreadSheet()
    },
    close: function () {
      this.formAttr.visible = false
      this.formAttr.loading = false
      this.$refs['formAttr'].resetFields()
    },
    onSure () {
      // this.formAttr.visible=false;
      // debugger
    },
    onPreview () {},
    onPreviewForm () {},
    onOpenModel () {
      debugger
      setTimeout(() => {
        this.formAttr.visible = true
      }, 2000)
    },
    closeDialog () {},
    onCellclick (id) {
      console.log('onCellclick:', id)
      const mydata = {
        visible: true,
        loading: false,
        rules: {},
        fields: {},
        gridData: [
          { name: '模型表', data: '', type: 'selectTable' },
          { name: '单元格', data: id, type: '' },
          { name: '文本', data: '', type: '' },
          { name: '数据类型', data: '', type: 'selectType' },
          { name: '默认值', data: '', type: '' },
          { name: '格式', data: '', type: '' }
        ]
      }
      this.id = id
      // this.formAttr.gridData[0].data = id
      this.formAttr.visible = true
      if (this.formArr[id]) {
        this.formAttr = this.formArr[id]
      } else {
        this.formAttr = mydata
        this.formArr[id] = mydata
      }
    },
    onSave () {
      console.log(this.formArr)
      debugger
    }
  }
}
</script>

<style>
@import "~@/assets/style/common.scss";
.designBox {
  display: flex;
}
.designBox .el-button--mini,
.el-button--mini.is-round {
  width: 70px;
  height: 30px;
  margin: 15px;
}
.pageDesign {
  width: 100% !important;
  overflow: hidden;
}
.tabTable .el-input__inner {
  border: 0 none !important;
  outline: none !important;
  height: 15px;
  line-height: 15px;
}
.drawbackTd {
  height: 152px;
}
.acceptTd {
  height: 76px;
}
.taxBox {
  display: flex;
}
.taxBoxL {
  width: 2%;
  padding: 0 4%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.taxBoxR {
  width: 100%;
}
.taxBoxR > div > span {
  display: inline-block;
  width: 20%;
  text-align: center;
}
.taxInput {
  display: flex;
}
.taxInput .el-input__inner {
  padding-left: 10%;
  height: 30px !important;
  line-height: 30px !important;
}
.ymd {
  display: flex;
}
.ymd > span {
  width: 50% !important;
  text-align: left !important;
}
.bg {
  background: #e9e9e9;
}
.border {
  border-bottom: 1px solid #ccc;
}
.borderL {
  border-right: 1px solid #ccc;
}
.padding {
  height: 37px;
  line-height: 37px;
  padding-left: 10px;
}
.padding .el-select .el-input {
  width: 100% !important;
}
.dialog {
  position: static !important;
}
.dialog > .el-dialog {
  position: fixed !important;
  z-index: 200;
  right: 0;
  margin-top: 25% !important;
  height: 348px !important;
}
.dialog .el-input__inner {
  border: none !important;
}
.dialog .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #333 !important;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 1;
}
</style>
