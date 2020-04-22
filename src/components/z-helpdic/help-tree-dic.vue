<!-- general tree help dictionary -->
<template>
  <el-dialog
    v-dialogDrag
    :title="title"
    :visible.sync="dialogVisible"
    :show="dialogVisible"
    @close="doClose"
  >
    <el-input placeholder="输入关键字进行过滤" :clearable="true" v-model="filterText"></el-input>
    <el-tree
      class="helptree dialog"
      :data="helpTree"
      ref="helpTree"
      :props="defaultProps"
      :show-checkbox="seltype"
      :highlight-current="true"
      node-key="id"
      :filter-node-method="filterNode"
      :default-expand-all="expandAll"
      :default-expanded-keys="expandedKeys"
      :expand-on-click-node="false"
      @node-click="doNodeClick"
    ></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click.native="doClose">取消</el-button>
      <el-button type="primary" size="mini" @click.native="doOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Helptable } from './helptable'
import { allApi } from '../../api'
import _ from 'lodash'

export default {
  name: 'help-tree-dic',
  props: {
    title: {
      type: String,
      default: '帮助字典'
    },
    dicname: {
      type: String,
      required: true
    },
    seltype: {
      type: Boolean,
      default: false
    },
    isLeaf: {
      // 控制是否只能选择叶子节点
      type: Boolean,
      default: true
    },
    expandAll: {
      // 控制是否只能选择叶子节点
      type: Boolean,
      default: true
    },
    max: {
      type: Number,
      default: 20
    },
    offset: {
      type: Number,
      default: 0
    },
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expandedKeys: [1],
      filterText: '',
      tables: Helptable,
      table: {},
      checkbox: false,
      helpTree: [],
      selectRows: null,
      dialogVisible: this.dialogShow,
      defaultProps: {
        children: 'children',
        label: 'fmc'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.helpTree.filter(val)
    },
    dialogShow (val) {
      this.dialogVisible = val
      if (val) {
        this.table = this.tables[this.dicname]
        this.load()
      }
    },
    dicname (dic) {
      this.table = this.tables[dic]
    }
  },
  methods: {
    filterNode (value, helpTree) {
      if (!value) return true
      return helpTree.fmc.indexOf(value) !== -1
    },
    doClose () {
      // let selectedRow = this.selectRows.slice(0);
      // this.selectRows = null;
      this.rows = []
      this.total = 0
      this.$refs.helpTree.setCheckedKeys([])
      this.$emit('close')
    },
    doOk () {
      // let selectedRow = this.selectRows.slice(0);
      // this.selectRows = null;
      this.rows = []
      this.total = 0
      if (this.seltype) {
        const checknode = this.$refs.helpTree.getCheckedNodes(true, true)
        this.$refs.helpTree.setCheckedKeys([])
        debugger
        this.$emit('helpdata', checknode, false)
      } else {
        this.$emit('helpdata', this.selectRows, false)
      }
      // this.$emit('gropudata', this.selectRows, false)
    },
    doNodeClick (data, node, event) {
      const nodeLeaf = node.isLeaf
      if (this.isLeaf) { // 设置了必须选择非明细
        if (!nodeLeaf) {
          this.$notify({
            type: 'warning',
            message: '不能选择非明细节点！'
          })
          this.selectRows = null
          return
        }
      }
      if (this.seltype) {
        // 多选
      } else {
        this.selectRows = data
        this.doOk()
      }
    },
    load () {
      // let criteria = {"fbh":{"$in":"select fxmbh from Bizsjfpbmx"}};
      let criteria = {}
      let serversort = {}
      let params = _.assign(
        {},
        {
          max: this.max,
          offset: this.offset,
          ...this.params
        },
        { sort: serversort },
        { criteria: criteria }
      )

      this.showLoading = true
      console.log(allApi)
      allApi[this.table.action](params)
        .then(response => {
          this.helpTree = [response]
          this.showLoading = false
        })
        .catch(error => {
          this.showLoading = false
        })
    }
  },
  mounted () {}
}
</script>

<style scoped>
.helptree {
  height: 500px;
  overflow-y: scroll;
}
</style>
