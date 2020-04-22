/**
 * 改密
 */
export default {
  data () {
    return {}
  },
  methods: {
    pshandleSubmit: function (password, password2, index) {
      var str = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])[A-Za-z1-9]{' + index + ',16}$'
      var re = new RegExp(str)
      if (!password) {
        this.$notify({
          title: '提示',
          message: '请输入密码',
          type: 'error'
        })
        return
      }
      if (password) {
        if (!re.test(password)) {
          this.$notify({
            title: '提示',
            message: '密码必须是8到16个字符，并且至少包括一个小写字母，一个大写字母和一个数字',
            type: 'error'
          })
          return
        }
      }
      if (password != password2) {
        this.$notify({
          title: '提示',
          message: '两次输入的不一致',
          type: 'error'
        })
        return
      }
      this.$confirm('确认修改' + name + ' 用户密码为' + password, '提示', {}).then(
        () => {
          this.psform.loading = true
          let params = _.assign({}, this.psform.fields)
          this.psform
            .url(params)
            .then(response => {
              let message = '密码修改成功！'
              if (response.code === -100) {
                this.psform.loading = false
                message = '修改密码失败！原因如下：' + response.msg.join('\r\n')
                this.$notify({
                  title: '提示',
                  message: message,
                  type: 'error'
                })
                return
              }
              this.psform.loading = false
              // this.$message({
              //     message: message,
              //     type: "success"
              // });
              this.$notify({
                title: '提示',
                message: message,
                type: 'success'
              })
              this.psform.visible = false
              this.reset()
              this.load()
            })
            .catch(error => {
              this.psform.loading = false
              this.$notify({
                title: '提示',
                message: error,
                type: 'error'
              })
            })
        },
        () => {
          this.$notify({
            title: '提示',
            message: '取消操作',
            type: 'info'
          })
        }
      )
    }

  }
}
