import { cleardomain } from '../api/admin'

/**
 * 清空操作
 */
export default {
  data () {
    return {
      cleardomain: cleardomain,
      tmpdomain: ''
    }
  },
  methods: {
    clear (domain) {
      this.tmpdomain = domain
      this.$confirm('确认执行数据清空?', '提示', {
        type: 'warning'
      }).then(() => {
        let domain = this.tmpdomain
        this.showLoading = true
        cleardomain(domain, this.query).then((response) => {
          if (response.data.code === -100) {
            // this.$message.error(response.data.msg);
            this.$notify({
              title: '警告',
              message: response.data.msg,
              type: 'error'
            })
            this.showLoading = false
            return
          }
          this.showLoading = false
          // this.$message({
          //     message: response.data.msg,
          //     type: "success"
          // });
          this.$notify({
            title: '提示',
            message: response.data.msg,
            type: 'success'
          })
          this.load()
        }).catch((error) => {
          this.showLoading = false
          // this.$message.error(error);
          this.$notify({
            title: '警告',
            message: response.data.msg,
            duration: 0,
            type: 'error'
          })
        })
      }).catch((error) => {
        console.log(error)
        // this.$message("取消操作");
        this.$notify({
          title: '提示',
          message: '取消操作',
          type: 'info'
        })
      })
    }
  }
}
