<template>
  <d2-container ref="container">
    <template slot="header">
      <el-form class="topHorizontal" label-width="120px" :model="formInline"  :inline="true" ref="header">
        <div class="header-querymodel">
          <el-form-item label="代码部分">
            <el-checkbox-group v-model="formInline.code">
              <el-checkbox  label="view">页面</el-checkbox>
              <el-checkbox  label="route">路由</el-checkbox>
              <el-checkbox  label="api">接口</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
              <el-form-item label="可编辑表格">
              <el-checkbox  v-model="formInline.editable" ></el-checkbox>
          </el-form-item>
          <el-form-item label="版本">
            <el-select v-model="formInline.version">
              <el-option label="v1" value="1"></el-option>
              <el-option label="v2" value="2"></el-option>
              <el-option label="v3" value="3"></el-option>
              <el-option label="v4" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="列布局">
            <el-select v-model.number="formInline.column">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="formInline.group" placeholder="模块名称"></el-input>
          </el-form-item>
          <el-form-item label="模型名称">
            <el-input v-model="formInline.title" placeholder="模型名称"></el-input>
          </el-form-item>
          <el-form-item label="模型" class="mft">
            <el-select v-model="formInline.domain" filterable placeholder="请选择模型">
              <el-option
                v-for="item in domains"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="形成模板" class="mft">
            <el-select v-model="formInline.type" placeholder="模板类型">
              <el-option label="表格" value="table"></el-option>
              <el-option label="树" value="tree"></el-option>
              <el-option label="模型定义" value="model"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item>
            <el-button type="primary" size="mini" :loading="loading" @click="onSure">确定</el-button>
            <el-button type="danger" size="mini" @click="onReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </template>
    <template>
      <div class="textareaBox">
        <el-tabs
          v-model="activeTab"
          :style="{'height':tableAutoHeight}"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="页面" name="first" v-if="isShow">
            <el-input type="textarea" :rows="18" placeholder="暂无内容" v-model="pagetext"></el-input>
          </el-tab-pane>
          <el-tab-pane label="路由" name="second" v-if="isShow">
            <el-input type="textarea" :rows="18" placeholder="暂无内容" v-model="routertext"></el-input>
          </el-tab-pane>
          <el-tab-pane label="接口" name="third" v-if="isShow">
            <el-input type="textarea" :rows="18" placeholder="暂无内容" v-model="apitext"></el-input>
          </el-tab-pane>
          <el-tab-pane label="模型定义" name="four" v-if="!isShow">
            <el-input type="textarea" :rows="18" placeholder="暂无内容" v-model="modeltext"></el-input>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </d2-container>
</template>

<script>
import serversort from '../../mix/serversort'
import types from '../../mix/types'
import table from '../../mix/table'
import { modellist, modelvue } from '../../api/develope/generator'
export default {
  name: 'generator',
  mixins: [serversort, types, table],
  data () {
    return {
      loading: false,
      domains: [],
      tableAutoHeight: null,
      formInline: {
        code: ['view', 'route', 'api'],
        editable: true,
        group: 'base',
        title: '',
        domain: '',
        type: 'table',
        version: '3',
        column: 1
      },
      activeTab: 'first',
      pagetext: '',
      routertext: '',
      apitext: ''
    }
  },
  computed: {
    isShow () {
      return this.formInline.type !== 'model'
    }
  },
  watch: {
    'formInline.type' (nv, ov) {
      if (nv === 'model') {
        this.activeTab = 'four'
      } else {
        this.activeTab = 'first'
      }
    }
  },
  mounted () {
    this.selectData()
    this.initLast()
    this.$nextTick(() => {
      // this.setHeight();
      this.setTableHeight()
    })
  },
  methods: {
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const headerHeight = this.$refs['header'].$el.parentNode.offsetHeight
      const dynamicHeight = containerHeight - headerHeight
      this.tableAutoHeight = dynamicHeight + 'px'
    },
    selectData () {
      modellist('')
        .then(response => {
          this.domains = response
        })
        .catch(() => {})
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    async initLast () {
      const value = await this.$store.dispatch('d2admin/db/get', {
        dbName: 'generator',
        path: 'generator.form',
        defaultValue: ''
      })
      if (value !== '') {
        this.formInline = value
      }
    },
    onSure () {
      let params = this.formInline
      this.$store.dispatch('d2admin/db/set', {
        dbName: 'generator',
        path: 'generator.form',
        value: params
      })
      this.loading = true
      modelvue(params)
        .then(response => {
          this.loading = false
          this.pagetext = response.vue
          this.routertext = response.router
          this.apitext = response.api
        })
        .finally(() => {
          this.loading = false
        })
    },
    onReset () {
      this.pagetext = ''
      this.routertext = ''
      this.apitext = ''
    }
  }
}
</script>

<style>
@import "~@/assets/style/common.scss";
.header-querymodel .el-form-item__label {
  width: 70px;
}
.header-querymodel .el-form-item__content {
  width: 300px;
}
.header-querymodel .el-select {
  width: 300px;
}
.header-querymodel .el-select--default {
  width: 300px;
}
.header-querymodel .el-input {
  width: 300px;
}
.header-querymodel .el-input--default {
  width: 300px;
}
.header-querymodel .el-input--suffix {
  width: 300px !important;
}
.mft {
  margin-top: 1px;
}
.textareaBox .el-textarea__inner {
  border: none;
}
</style>
