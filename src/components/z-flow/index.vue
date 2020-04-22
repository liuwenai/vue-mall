<!-- general tree help dictionary -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :show="dialogVisible"
    @close="doClose"
    :width="width"
    :height="height"
  >
    <el-form :model="form.fields" label-width="110px" :rules="form.rules" ref="form">
      <el-form-item prop="fdjzt" label="审批动态" :error="form.errors.fdjzt">
        <el-radio-group  v-model="form.fields.fdjzt" @change="onChange">
          <el-radio label="9">同意</el-radio>
          <el-radio label="2">退回</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="fspyj" label="审批意见" :error="form.errors.fspyj">
        <el-input type="textarea" v-model="form.fields.fspyj" placeholder="审批意见"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" size="mini" @click="onAudit" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'flow-action',
  props: {
    title: {
      type: String,
      default: '流程审批'
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '200px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    doAudit: {
      type: Function,
      default: () => {}
    },
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.dialogShow,
      form: {
        rules: {
          fdesc: [
            {
              required: true,
              message: '审批意见不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              message: '审批意见字符串',
              trigger: 'blur'
            }
          ],
          fdjzt: [
            {
              required: true,
              message: '单据状态不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              message: '单据状态必须为字符串',
              trigger: 'change'
            }
          ]
        },
        errors: {},
        fields: {
          fspyj: '同意',
          fdjzt: '9'
        }
      }
    }
  },
  watch: {
    dialogShow (val) {
      this.dialogVisible = val
    },
    dicname (dic) {
      this.table = this.tables[dic]
    }
  },
  methods: {
    doClose () {
      this.$emit('close')
    },
    onAudit () {
      this.$emit('doAudit', this.form.fields)
    },
    onChange (v) {
      if (v === '9') {
        this.form.fields.fspyj = '同意'
      } else {
        this.form.fields.fspyj = '不同意'
      }
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
// @import '../../scss/variables.scss';
// .el-dialog__body{
//   padding:5px 20px
// }
// .el-dialog__header{
//     background: $--color-primary;

// }
</style>
