import { fileAction } from '../api/file'

import _ from 'lodash'
import util from '@/libs/util.js'

export default {
  data () {
    return {
      pictureDialogVisible: false,
      dialogImageUrl: '',
      showfile: true,
      loadingtext: '',
      fileAction: fileAction,
      uploadParam: {},
      header: {
        token: ''
      }
    }
  },
  mounted () {
    const token = util.cookies.get('token')
    this.header = { token: token }
  },
  methods: {
    // 上传前处理
    doBefore () {},
    doLast () {},
    beforeUpload (file) {
      const token = util.cookies.get('token')
      this.header = { token: token }
      this.doBefore()
    },
    uploadSuccess (response) {
      debugger
      this.loadingtext = ''
      this.showfile = false
      const { code, msg } = response
      let message = msg
      let type = 'success'
      if (code === -100) {
        // 失败了，显示具体的数据消息
        type = 'warning'
        const errorMsgs = []
        const errors = response.errors
        if (!_.isNil(errors)) {
          errors.forEach(error => {
            errorMsgs.push(error.message)
          })
          message += errorMsgs.join('\r\n')
        }
      }
      this.loadingtext = message
      this.$notify({
        message,
        type,
        duration: 0
      })
      this.doLast()
    },
    onProgress (event, file, fileList) {
      this.showLoading = true
      this.loadingtext = '上传处理中...'
    },
    showUploadError (errors) {}
  }
}
