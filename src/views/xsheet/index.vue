<template>
  <div id="x-spreadsheet-report"></div>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'

export default {
  name: 'spreadsheet',
  data () {
    return {
      query: {
        colss: []
      }
    }
  },
  mounted () {
    this.initXspreadSheet()
  },
  methods: {
    initXspreadSheet () {
      // eslint-disable-next-line no-undef
      new Spreadsheet('#x-spreadsheet-report', {
        showContextmenu: false,
        showToolbar: true,
        showGrid: true,
        readOnly: true,
        row: {
          len: 25,
          height: 25
        },
        col: {
          len: 7,
          width: 100,
          indexWidth: 60,
          minWidth: 60
        }
      })
        .loadData({
          name: 'sheet1',
          cols: this.query.colss,
          freeze: 'A1',
          validations: [],
          rows: {
            0: {
              cells: {
                0: { text: '姓名', readOnly: true },
                2: { text: '性别', readOnly: true },
                4: { text: '民族', readOnly: true }
              }
            },
            1: {
              cells: {
                0: { text: '出生年月', readOnly: true },
                2: { text: '籍贯', readOnly: true },
                4: { text: '政治面貌', readOnly: true }
              }
            },
            2: {
              cells: {
                0: { text: '专业', readOnly: true },
                4: { text: '学历', readOnly: true }
              }
            },
            3: {
              cells: {
                0: { text: '所在单位', readOnly: true },
                4: { text: '科室', readOnly: true }
              }
            },
            4: {
              cells: {
                0: { text: '职称', readOnly: true },
                4: { text: '职务', readOnly: true }
              }
            },
            5: {
              cells: {
                0: { text: '手机号码', readOnly: true },
                4: { text: 'E-mail', readOnly: true }
              }
            },
            6: {
              cells: {
                0: { text: '联系地址', readOnly: true },
                5: { text: '邮编', readOnly: true }
              }
            },
            7: {
              cells: {
                0: { text: '申请总会任职', readOnly: true }
              }
            },
            8: {
              cells: {
                0: { text: '申请二级机构', readOnly: true },
                1: { text: '二级机构名称', readOnly: true }
              }
            },
            9: {
              cells: {
                0: { text: '及任职', readOnly: true }
              }
            },
            10: {
              cells: {
                0: { text: '个人简历', readOnly: true }
              }
            }
          }
        })
        // .dragCol((c, d) => {
        //   var obj = this.query.colss;
        //   obj[c.ci] = { width: d };
        //   this.query.colss = obj;
        //   this.saveReport();
        // })
        .change(data => {
          // 这是输出的是对应的格式，设计好后，那这个数据放到参数配置里
          console.log('表格格式数据')
          console.log(JSON.stringify(data))
          this.query.colss = data.cols
          this.saveReport()
          alert(JSON.stringify(data))
          // save data to db
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/common.scss";

.designBox {
  display: flex;
}

.pageDesign {
  width: 100% !important;
  overflow: hidden;
}
</style>
