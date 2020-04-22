/**
 * 转换数据
 */
export default {
  data () {
    return {
    }
  },
  methods: {
    getdata: function (typedata, rowdata) {
      var obj = {}
      // const mydata = ['id','topic','flb','frs','dateCreated','lastUpdated']
      for (var i = 0; i < rowdata.length + 1; i++) {
        let cell = {}
        typedata.forEach((item, index) => {
          if (i === 0) {
            cell[index] = { text: item.lable }
          } else {
            if (item.format) {
              cell[index] = { text: this[item.format](rowdata[i - 1][item.key]) }
            } else {
              cell[index] = { text: rowdata[i - 1][item.key] }
            }
          }
        })
        obj[i] = Object.assign({}, { cells: cell })
      }
      return obj
    },
    spreadsheet (data) {
      const options = {
        events: {
          export: this.exportEcl
        },
        view: {
          height: () => this.$refs['container'].$el.clientHeight,
          width: () => this.$refs['container'].$el.clientWidth - 25
        },
        formats: [],
        fonts: [],
        formula: [],
        row: {
          len: 100,
          height: 25
        },
        col: {
          len: this.mydata.length,
          width: 100,
          indexWidth: 60,
          minWidth: 60
        },
        style: {
          bgcolor: '#ffffff',
          align: 'left',
          valign: 'middle',
          textwrap: false,
          textDecoration: 'normal',
          strikethrough: false,
          color: '#0a0a0a',
          font: {
            name: 'Helvetica',
            size: 10,
            bold: false,
            italic: false
          }
        }
      }
      var obj = data
      // eslint-disable-next-line no-undef
      const s = x
        .spreadsheet(`#${this.id}`, options)
        .loadData({
          freeze: 'B2',
          cols: this.query.colss,
          rows: obj
        }
        )
        .change(data => {
          this.spreadsheetData = data
          // alert(data)
          // save data to db
        })
        .dragCol((c, d) => {
          var obj = this.query.colss
          obj[c.ci] = { width: d }
          this.query.colss = obj
          this.saveReport()
        })
    }
  }
}
