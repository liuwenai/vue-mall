import { bookUpload } from '../api/mall/book'

import _ from 'lodash'
import util from '@/libs/util.js'

export default {
  data() {
    return {
      pictureDialogVisible: false,
      dialogImageUrl: '',
      showfile: true,
      loadingtext: '',
      bookUpload: bookUpload,
      uploadParam: {},
      header: {
        token: ''
      }
    }
  },
  mounted() {
    const token = util.cookies.get('token')
    // this.header = { 'Authorization: Bearer ': token }
  },
  methods: {
    // 上传前处理
    doBefore() { },
    doLast() { },
    beforeUpload(file) {
      // const token = util.cookies.get('token')
      // this.header = { 'Authorization: Bearer ': token }
      this.doBefore()
    },
    uploadSuccess(response) {
      debugger
      this.loadingtext = ''
      this.showfile = false
      const { code, mgs } = response
      let message = mgs
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
      this.form.visible = false;
    },
    onProgress(event, file, fileList) {
      this.showLoading = true
      this.loadingtext = '上传处理中...'
    },
    showUploadError(errors) { }
  }
}
