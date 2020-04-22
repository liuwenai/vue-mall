通用帮助组件

help-tree-dic.vue

树数据帮助字典

help-table-dic.vue

表格数据帮助字典


## 使用方式 在需要使用的 vue 文件中

1、引入
    import HelpTableDic from "../../components/z-helpdic/help-table-dic";
2、配置组件
      export default {
        components:{HelpTableDic},
      }

3、代码中使用

    <help-table-dic :params="params" title="项目字典" height=400 seltype="S" dicname="dicxmzd" :dialog-show="helpdicvisible" @helpdata="selectHelpDic"/>
